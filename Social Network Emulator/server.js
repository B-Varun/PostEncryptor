const admin = require('firebase-admin');
var http = require('http');
const express = require('express');
var serviceAccount = require("./SNEserviceAccountKey.json");
var app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const {v4: uId} = require('uuid');
app.set('port', 5000);
app.use(cors());
app.use(bodyParser.json());


const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pds-db-5f1c2-default-rtdb.firebaseio.com"
  });
  const db = admin.firestore();

  app.get('/', (req, res) => {
    res.send('hey, welcome to SNE');     
});

app.post('/login', async (req, res) => {
  let user= await validateIfUserExists(req.body.user.userEmail, req.body.user.userPassword);
  let userFound = user.isUserFound;
  let id = user.userId;  
  if(userFound){
    res.status(200).json({"status" : "User logged in", "id":id});
    console.log("200");
  }
  else {
    console.log("404");
    res.status(400).json({"status":"User not registered"});
  }
});

app.post('/signUp', async (req, res) => {
  registerUserWithSNE(req.body.userCredentials.userEmail, req.body.userCredentials.userPassword);
  res.status(200).json({"stauts" : "User registered"});
});

app.get('/getPosts', async (req, res) => {
  fetchPostsFromDB();
});

app.post('/addPost', async (req, res)=>{
addNewPostToDB(req.body.userId, req.body.pdsPostId);
res.status(200);
});

app.get('/getAllPosts', async(req, res) => {
  const posts = await fetchPostsFromDB();
  res.send(posts);
});

  app.listen(5000, () => {
    console.log("Listening for requests");
});

async function fetchPostsFromDB(){
  let postsArray = [];
let dbData = await db.collection("posts");
let fetchingPosts = await dbData.orderBy("timeStamp", "desc").get().then(
  (queryData) => {
  queryData.forEach((singlePost) => {
    const uid = singlePost._fieldsProto.postId.stringValue;
    const pid = singlePost._fieldsProto.posterId.stringValue;    
    const postValue = singlePost._fieldsProto.post.stringValue;
    const post = {
      userId : pid, 
      postId : uid,
      data : postValue
    };
    postsArray.push(post);

  });
});
return postsArray;
}

async function addNewPostToDB(ownerId, pdsPostId){
  let postId = uId();
  const post = {
    postId,
    post : pdsPostId,
    posterId : ownerId,
    timeStamp : new Date()
  };
  await db.collection('posts').doc(postId.toString()).set(post);
}

async function validateIfUserExists(email, password){
let isUserFound=false;
let registeredUsers = await db.collection('users');
let userId;
let status = await registeredUsers.get().then((userData) => {
    userData.forEach(doc => {
      console.log("User data : "+doc);
      let userEmail = doc. _fieldsProto.userEmail.stringValue;
      let userPassword = doc. _fieldsProto.userPassword.stringValue
      let uId  = doc. _fieldsProto.UID.stringValue;
      if(userEmail === email && userPassword === password){
        isUserFound = true;
        console.log(userEmail, userPassword, uId);
        userId = uId;
      }
    })
});
return { isUserFound, userId };
}

async function registerUserWithSNE(email, password){
  const user = {
    UID : uId(),
    userEmail : email,
    userPassword : password
  };

  await db.collection('users').doc(user.UID.toString()).set(user);
}