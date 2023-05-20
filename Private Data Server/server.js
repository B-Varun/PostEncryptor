const admin = require('firebase-admin');
var http = require('http');
const file = require('fs');
const express = require('express');
const crypto = require('crypto');
const CryptoJS = require("crypto-js");
var serviceAccount = require("./PDSserviceAccountKey.json");
var app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const {v4: uId} = require('uuid');
const jsRSA = require('jsrsasign');
app.set('port', 4000);
app.use(cors());
app.use(bodyParser.json());


let diffieHellman = crypto.getDiffieHellman('modp14');
let diffieHellmanAlgo = crypto.createDiffieHellman(
    diffieHellman.getPrime(), 
    diffieHellman.getGenerator()
); 
let clientPublicKey, sharedSecret, server_PublicKey, server_PrivateKey;

if (file.existsSync("DiffieHellmankeys.json")) {
    console.log('File exists');
    let { pubKey, privKey } = readKeyPairsFromFile();
    server_PrivateKey = privKey;
    server_PublicKey = pubKey;
    console.log("Pub Key : "+diffieHellmanAlgo.getPublicKey().toString('hex'));
    console.log("\n\nPriv Key : "+diffieHellmanAlgo.getPrivateKey().toString('hex'));
  } else {
    console.log('File does not exist');
    const fd = file.openSync("DiffieHellmankeys.json", "w+");
    // const diffieHellmanAlgo = crypto.createDiffieHellman(
    //     diffieHellman.getPrime(), 
    //     diffieHellman.getGenerator()
    // ); 
    // const {publicKey: server_PublicKey , privateKey: server_PrivateKey} = createDiffieHellmanKeyPairs();
     let {publicKey , privateKey} = createDiffieHellmanKeyPairs();
server_PublicKey = publicKey;
server_PrivateKey = privateKey;

    const keys = {
        g: diffieHellmanAlgo.getGenerator(),
        p: diffieHellmanAlgo.getPrime(),
        publicKey : server_PublicKey, 
        privateKey : server_PrivateKey
    };
    
    file.write(fd, JSON.stringify(keys), (err) =>{
        if(err){
            console.log("Error : "+err);
            return;
        }
        console.log("Stored the keys to a file in the server filesystem");
        file.closeSync(fd)
    } );
  }

// Diffie Hellman Public and Private Keys file
// const fd = file.openSync("DiffieHellmankeys.json", "w+");

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

/*
let diffieHellman = crypto.getDiffieHellman('modp14');
const diffieHellmanAlgo = crypto.createDiffieHellman(
                                diffieHellman.getPrime(), 
                                diffieHellman.getGenerator()
                            ); 
let clientPublicKey;
const {publicKey: server_PublicKey ,
     privateKey: server_PrivateKey} = createDiffieHellmanKeyPairs();
*/

function readKeyPairsFromFile(){
    const dhData = JSON.parse(file.readFileSync('DiffieHellmankeys.json'));
    // diffieHellmanAlgo = crypto.createDiffieHellman(Buffer.from(dhData.p.data).toString('hex'), 
    //                                                Buffer.from(dhData.g.data).toString('hex'));
    // diffieHellmanAlgo.setPublicKey(Buffer.from(dhData.publicKey.data).toString('hex'));
    // diffieHellmanAlgo.setPrivateKey(Buffer.from(dhData.privateKey.data).toString('hex'));

    // diffieHellmanAlgo = crypto.createDiffieHellman(Buffer.from(dhData.p.data, "hex"), 
    //                                                Buffer.from(dhData.g.data, "hex"));
    diffieHellmanAlgo.setPublicKey(Buffer.from(dhData.publicKey.data, "hex"));
    diffieHellmanAlgo.setPrivateKey(Buffer.from(dhData.privateKey.data, "hex"));


    // let pubKey =  diffieHellman.getKeys();
    let pubKey = diffieHellmanAlgo.getPublicKey().toString('hex');
    let privKey = diffieHellmanAlgo.getPrivateKey().toString('hex');
    // let pubKey = diffieHellmanAlgo.generateKeys('hex');
    // let privKey = diffieHellmanAlgo.getPrivateKey('hex');
    return {pubKey, privKey};
}


/*

Code to store keys to a file

const keys = {
    g: diffieHellmanAlgo.getGenerator(),
    p: diffieHellmanAlgo.getPrime(),
    publicKey : server_PublicKey, 
    privateKey : server_PrivateKey
};

file.write(fd, JSON.stringify(keys), (err) =>{
    if(err){
        console.log("Error : "+err);
        return;
    }
    console.log("Stored the keys to a file in the server filesystem");
} );

console.log("\n\n\n");
readKeyPairsFromFile();


function readKeyPairsFromFile(){
    const dhData = JSON.parse(file.readFileSync('DiffieHellmankeys.json'));
    diffieHellmanAlgo = crypto.createDiffieHellman(Buffer.from(dhData.g.data).toString('hex'), 
                                                   Buffer.from(dhData.p.data).toString('hex'));
    diffieHellmanAlgo.setPublicKey(Buffer.from(dhData.publicKey.data).toString('hex'));
    diffieHellmanAlgo.setPrivateKey(Buffer.from(dhData.privateKey.data).toString('hex'));
}
*/


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pds-db-5f1c2-default-rtdb.firebaseio.com"
});
const db = admin.firestore();

function createDiffieHellmanKeyPairs(){
let publicKey = diffieHellmanAlgo.generateKeys();
let privateKey = diffieHellmanAlgo.getPrivateKey();
// let publicKey = clientDiffiehellmangroup.getPublicKey();
// console.log("PrivateKey : "+privateKey.toString('hex')+"\n\nPublic Key : "+publicKey.toString('hex'));
return {publicKey, privateKey};
}

app.get('/', (req, res) => {
    res.send('hello');     
});

app.get('/pubKey', (req, res) => {
    res.send(server_PublicKey.toString('hex'));
});

// app.get('/getPost/:pid/:email/:pubKey', async (req, res) => {
    app.get('/getPost', async (req, res) => {
    const {postId, pubKey, email} = req.query;
    console.log("Post Id : "+postId+"\nPubKey : "+pubKey+"Email : "+email);
    let response = await encryptPostWithViewerSharedKey(postId, email);
    // console.log(response);
    res.send({response});
});

app.listen(4000, () => {
    console.log("Listening for requests");
});

app.post('/signUp', (req,res) => {
// clientPublicKey = Buffer.from(req.body.clientPublicKey, 'hex');
performUserSignUp(req, res);
});

// app.post('/getPost', async(req, res) => {
//     console.log(req.body.postId, req.body.email, req.body.publicKey);
// });

    app.post('/addNewPost', async (req, res) => {
        let id = await extractAndAddPost(req.body.clientResponse);
        console.log({"postId":id});
        res.send({"postId":id});
    });

    async function encryptPostWithViewerSharedKey(postId, viewerEmail){
        let viewerSharedSecret = await fetchSharedSecretFromDB(viewerEmail);
        let {encryptedPost, originalDigitalSignature, posterEmail, iv:encPost_iv, posterRSAPublicKey} = await fetchPostDetailsFromPostId(postId);
        let posterSharedSecret = await fetchSharedSecretFromDB(posterEmail);
        sharedSecret = posterSharedSecret;
        let decryptedPostData = await decryptPostWithPosterSharedSecret(encryptedPost, encPost_iv);
        // console.log("Decrypted Post Data : "+decryptedPostData+"\n\n");

        sharedSecret = viewerSharedSecret;

        console.log("\n\nEnc with viewer shared secret : "+decryptedPostData, encPost_iv);

        let encContent = await encryptPostWithViewerSharedSecret(decryptedPostData, encPost_iv); 
        // let {postDigitalSignature, publicKey:rsaServerPublicKey } = await creatDigitalSignauteForPost(decryptedPostData);
        // console.log("REturned data after signature : ");
        // console.log(signature);
        // console.log(rsaServerPublicKey);

// console.log("\n\nDigital signature : "+signature.toString('hex')+"\n\n");
// signature = signature.toString('hex');
        const postResponse = {
            encPost : encContent.toString(),
            iv : encPost_iv,
            digitalSignature : originalDigitalSignature,
            rsaPubKey : posterRSAPublicKey
        };

        return postResponse;

/*        console.log("Enc with viewer shared secret : "+encContent);
        // The next line decrypts post with Viewer shared key itself, its only the method that I'm reusing. 
        let decP = await decryptPostWithPosterSharedSecret(encContent, encPost_iv);
        console.log("Dec with shared sec of viewer : "+decP);
        */
    };

    async function creatDigitalSignauteForPost(plainTextPost, rsaPublicKey){
        console.log("plain post : "+plainTextPost);
        let postDigest = await createPostDigest(plainTextPost);
        console.log("Digest of the post is : "+postDigest);


            const {privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem',
                  },
                  privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                  },
              });
             
            //   console.log("Generated keys are : "+publicKey, privateKey);

            //   console.log("Generated Public Key: " + publicKey.export({ type: 'spki', format: 'pem' }));
            //   console.log("Private Key : "+privateKey.toString());

              let signatureCreator = new jsRSA.KJUR.crypto.Signature({alg: "SHA256withRSA"});
                            // signatureCreator.init(rsaServerPrivateKey);
                            // signatureCreator.init(rsaPublicKey);
                            signatureCreator.init(privateKey);
                        //   signatureCreator.init(privateKey.export({ type: 'spki', format: 'pem' }));
                            // signatureCreator.updateString(postDigest);
                            // signatureCreator.updateHex(postDigest);
                            let postDigitalSignature = signatureCreator.signString(plainTextPost);
                            return { postDigitalSignature, publicKey};

//    try{
//               let signatureCreator = new jsRSA.KJUR.crypto.Signature({alg: "SHA256withRSA"});
//             //   signatureCreator.init(rsaServerPrivateKey);
//             signatureCreator.init(rsaPublicKey);
//               signatureCreator.updateString(postDigest);
//               let postDigitalSignature = signatureCreator.sign();
//               console.log("Is Post Authentic : "+postDigitalSignature);
//               }catch(error){
//                 console.log(error);
//               }


// const privateKey = `-----BEGIN RSA PRIVATE KEY-----
// MIICXQIBAAKBgQCo3cBUt9T1DA4ahjtBrs8RQfGsaL2iibv6y1KB7LhoRzih6x7x
// 7bbyoEMb7Uqe06+SBKNpEW7jNEAlRftV1DizT6z5EoaV/IwIqdJYGQvN0sXbtsIY
// Go8qi8xJiNiN0xBKdUP2EAL3vO5sM6rq45SaApqJMukf6jL4m7z9c+37WwIDAQAB
// AoGAXwuJEGXz6ATj/0vkGGEizSzXsNm3Or/ZXRyJkPVDCfZkSsaCwVqx6TgI7bQO
// lvzAyifwLdgRGLK1FAWipDlxu5kEMUTH8zLPGT+KC8q7JMRJ6RQegGacmsaVyBiV
// /wp6V2GgqFqhzI/nBm/uKQPRFcUNlzBlAFSwo1v4pTTo2TECQQDW07wyUnomSmOU
// Zh4bgwLKvkMXC8N8DxL9sxj4SdT2e4LJY5keEeh/OQyZCq1N1UCdyWZnWGaygp5I
// 5AFMjnupAkEAyTr+iG4vCrqDdFOn/iN6VCatrEwtid/SPipMnvp6F4qu3h2aTryh
// 77KROeP2a9JP/S9FG3HZTceL3Wgt2uSBYwJBALcpfisVoSnmgPK1AnSIhifggoky
// sXCj1ZhTTDXdlWK2OfOFJLa7pBRcyr3tmYdkDBy768CvYZhPv678H5NrZEkCQAld
// b38V8aaEK538TrMrH4RPEIIWQYBLJFO0UECN06TI1X6MziOf78FiBBQ3ob4+2W4l
// BwhR8hUGlmHFeWzYeZUCQQDTXKBlG2/nPfW6H83gRdlwU+iHtFYY2am/zuOX2s2h
// 6Tamiy+Fo4VgIafKvifaRwTESSdjIuIVjhAXDKhkq3Ea
// -----END RSA PRIVATE KEY-----`

// const publicKey = `-----BEGIN PUBLIC KEY-----
// MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCo3cBUt9T1DA4ahjtBrs8RQfGs
// aL2iibv6y1KB7LhoRzih6x7x7bbyoEMb7Uqe06+SBKNpEW7jNEAlRftV1DizT6z5
// EoaV/IwIqdJYGQvN0sXbtsIYGo8qi8xJiNiN0xBKdUP2EAL3vO5sM6rq45SaApqJ
// Mukf6jL4m7z9c+37WwIDAQAB
// -----END PUBLIC KEY-----`



// const sign = crypto.createSign('SHA256');
// sign.update(postDigest);
// // return sign.sign(privateKey, 'base64');
// let signedData =  sign.sign(privateKey, 'base64');
// console.log("Signed data : "+signedData);

// sign.createVerify('SHA256');
// sign.update(signedData);
// let isCorrect = sign.verify(publicKey, signedData, 'base64');
// console.log("\n\nIs the digi sign verified : "+isCorrect);



/*const sign = crypto.createSign('SHA256');
sign.update(postDigest);
sign.end();
const signature = sign.sign(privateKey);
// console.log("After signing data : "+signature);

// const verify = crypto.createVerify('SHA256');
// verify.update(postDigest);
// verify.end();
// console.log(verify.verify(publicKey, signature));

let rsaServerPublicKey = publicKey;
// .export({ type: 'spki', format: 'pem' });
// let rsaServerPublicKey = publicKey;
return { signature, rsaServerPublicKey};
*/



        // let signatureCreator = new jsRSA.KJUR.crypto.Signature({alg: "SHA256withRSA"});
        // signatureCreator.init(rsaPublicKey);
        // signatureCreator.updateString(postDigest);
        // let postDigitalSignature = await signatureCreator.sign();
        // console.log("Is Post Authentic : "+postDigitalSignature);
        // }catch(error){
        //     console.log(error);
        // }
    }

    async function encryptPostWithViewerSharedSecret(post, iv64){
    let iv_WordArray = CryptoJS.enc.Base64.parse(iv64);
    let sharedSecretInBytes = CryptoJS.enc.Hex.parse(sharedSecret);
    let encSecretCipher = CryptoJS.AES.encrypt(
        post,
        sharedSecretInBytes, 
        {iv:iv_WordArray, mode: CryptoJS.mode.CBC}
    );
    return encSecretCipher;
    // If no new iv is created then we dont need to send it. 
    // return { encContent:encSecretCipher, iv:iv_WordArray };
    }

// This function can decrypt data using s shared secret. It is not specific to a viewer or a poster. 
    async function decryptPostWithPosterSharedSecret(encPost, ivBase64){
                // Convert the Base64-encoded initialization vector to a WordArray object
                let iv_WordArray = CryptoJS.enc.Base64.parse(ivBase64);
                // Convert the Base64-encoded ciphertext to a WordArray object
                    let sharedSecretInBytes = CryptoJS.enc.Hex.parse(sharedSecret);
                    // console.log("Shared secret of the user  : "+sharedSecret);
                // Decrypt the ciphertext using the shared secret key and the initialization vector
                    let plaintext = CryptoJS.AES.decrypt(
                        encPost, 
                        sharedSecretInBytes, 
                        { iv : iv_WordArray,  mode: CryptoJS.mode.CBC }
                    );
                // Convert the decrypted plaintext to a string
                let post = plaintext.toString(CryptoJS.enc.Utf8);
                return post;
    }

    async function extractAndAddPost(clientResponse){
    let clientEmail = clientResponse.userEmail;
    // let posterSharedKey = await fetchSharedSecretFromDB(clientEmail);
    // await validateAndStorePost(posterSharedKey, clientResponse);
    sharedSecret = await fetchSharedSecretFromDB(clientEmail);
    let postId = await validateAndStorePost(clientResponse);
    // console.log("Returned post id : "+postId);
    return postId;
    }



    const validateAndStorePost = async (clientResponse) =>{
        let encPost = clientResponse.encryptedPost;
        let postDigitalSignature = clientResponse.digiSign;
        let ivBase64 = clientResponse.iv;
        let clientPubKey = clientResponse.rsaPubKey;
        let clientEmail = clientResponse.userEmail;

        // Convert the Base64-encoded initialization vector to a WordArray object
        let iv_WordArray = CryptoJS.enc.Base64.parse(ivBase64);
    // Convert the Base64-encoded ciphertext to a WordArray object
        let sharedSecretInBytes = CryptoJS.enc.Hex.parse(sharedSecret);
        // console.log("Shared secret of the user  : "+sharedSecret);
    // Decrypt the ciphertext using the shared secret key and the initialization vector
        let plaintext = CryptoJS.AES.decrypt(
            encPost, 
            sharedSecretInBytes, 
            { iv : iv_WordArray,  mode: CryptoJS.mode.CBC }
        );
    // Convert the decrypted plaintext to a string
    let post = plaintext.toString(CryptoJS.enc.Utf8);
    
    console.log("Post : "+post);
    let isPostAuthentic = await validateDigitalSignatureOfPost(post, postDigitalSignature, clientPubKey);
    if(isPostAuthentic){
        // console.log("The post is authentic");
         return addUserPostToDB(clientEmail, encPost, postDigitalSignature, ivBase64, clientPubKey);
    }
    return 0;
    };

    async function validateDigitalSignatureOfPost(post, postDigitalSignature, clientPubKey){
        console.log("Received post : "+post);
        let postDigest = await createPostDigest(post);
        let signatureVerifier = new jsRSA.KJUR.crypto.Signature({alg: "SHA256withRSA"});
        signatureVerifier.init(clientPubKey);
        signatureVerifier.updateString(postDigest);
        let isPostAuthentic = await signatureVerifier.verify(postDigitalSignature);
        // console.log("Is the post posted by owner : "+isPostAuthentic);
        return isPostAuthentic;
    }

    async function createPostDigest(post){
        let postDigest = CryptoJS.SHA256(post).toString(CryptoJS.enc.Hex);
        // console.log("Digest calculated : "+postDigest);
        return postDigest;
    }

async function addUserPostToDB(email, encPost, postDigitalSignature, ivBase64, rsaPubKey){
    let postId = uId();
    const post = {
        postId,
        posterEmail : email,
        encryptedPost : encPost,
        digitalSignature : postDigitalSignature,
        iv : ivBase64,
        posterRSAPublicKey : rsaPubKey
    };
    await db.collection("posts").doc(postId.toString()).set(post);
    return postId;
}

function performUserSignUp(req, res){
    // console.log(req.body.signUpData);
const reqData = req.body.signUpData;
// console.log(reqData);
let userEmail = reqData.userEmail;
let encPwd = reqData.passwd;
let ivBase64 = reqData.iv;
clientPublicKey = reqData.cliPubKey;
generateSharedSecret();
/*
These 3 lines end and dec shared key

let encSharedSec_PDS_Pub = encrypt_Secret_PDS_PublicKey(ivBase64);
console.log("encSharedSec_PDS_Pub : ",encSharedSec_PDS_Pub);

let decSharedSec_PDS_Priv = decrypt_Secret_PDS_PrivateKey(encSharedSec_PDS_Pub, ivBase64);
*/

// Save data to db
const credentials = {
    email : userEmail,
    encryptedPasswd : encPwd,
    pubKey : clientPublicKey,
    // encryptedSecret : encSharedSec_PDS_Pub,
    iv : ivBase64
}
registerUserToDB(credentials);

// Decrypt password working
// decryptPassword(encPwd, ivBase64);
res.send("Done");
}


async function fetchSharedSecretFromDB(clientEmail){
let extractedSharedSecret;
let dbRecord = db.collection("users");
let result = await dbRecord.get().then((users) => {
users.forEach((user) => {
// console.log(user.data().userEmail, user.data().encSecretKey);
if(user.data().userEmail === clientEmail){
    // console.log("Shared Secret from DB : "+user.data().encSecretKey);
    extractedSharedSecret = user.data().encSecretKey;
}
})});
return extractedSharedSecret;
}

/* Both the functions enc and dec shared secret for every client. 
    They are encrypted using Server Private Key and dec using server public key 

function encrypt_Secret_PDS_PublicKey(iv64){
// Using the same iv shared by client enc shared key and return it.
    let iv_WordArray = CryptoJS.enc.Base64.parse(iv64);
    
    let serverPublicKeyInBytes = CryptoJS.enc.Hex.parse(server_PublicKey);
    let encSecretCipher = CryptoJS.AES.encrypt(
        sharedSecret, 
        serverPublicKeyInBytes, 
        {iv:iv_WordArray}
    );

    return encSecretCipher;
}

function decrypt_Secret_PDS_PrivateKey(encSharedSecret ,iv64){
    let iv_WordArray = CryptoJS.enc.Base64.parse(iv64);

    let serverPrivateKeyInBytes = CryptoJS.enc.Hex.parse(server_PrivateKey);
    let decSecretCipher = CryptoJS.AES.decrypt(
        encSharedSecret,
        serverPrivateKeyInBytes,
        {iv : iv_WordArray, mode: CryptoJS.mode.CBC}
        );

    return decSecretCipher;
}
*/

function decryptPassword(encCipher, iv64){
// Convert the Base64-encoded initialization vector to a WordArray object
    let iv_WordArray = CryptoJS.enc.Base64.parse(iv64);

// Convert the Base64-encoded ciphertext to a WordArray object
    // let cipherText = encCipher;
    let sharedSecretInBytes = CryptoJS.enc.Hex.parse(sharedSecret);
// Decrypt the ciphertext using the shared secret key and the initialization vector
    let plaintext = CryptoJS.AES.decrypt(
        encCipher, 
        sharedSecretInBytes, 
        { iv : iv_WordArray,  mode: CryptoJS.mode.CBC }
    );
// Convert the decrypted plaintext to a string
let password = plaintext.toString(CryptoJS.enc.Utf8);
console.log("Decrypted password : "+password);
}



// app.post('/signUp', (req, res) => {
//     console.log("\n\n\nSignUp attempt");
//     registerUserToDB(req.body);
//     res.send("Done");
// });

function registerUserToDB(credentials){
     const user = {
        Id : uId(),
        userEmail : credentials.email,
        password : credentials.encryptedPasswd,
        clientPublicKey : credentials.pubKey,
        // encSecretKey : credentials.encryptedSecret,
        encSecretKey : sharedSecret,
        iv : credentials.iv
    };

// Decrypt password working 
// decryptPassword(user.password, user.iv);

    // db.collection("users").doc(user.Id.toString()).set(user).
    // then((response) => response.text()).
    // then((data) =>{ 
    // console.log("Data : "+data)
    // }
    // );

    db.collection("users").doc(user.Id.toString()).set(user);
}


function generateSharedSecret(){
    console.log("Client pub key : "+clientPublicKey);
    sharedSecret = diffieHellmanAlgo.computeSecret(Buffer.from(clientPublicKey, "hex"), null, "hex");
    console.log("\n\nShared Secret : "+sharedSecret);
    // console.log("Shared secret : "+sharedSecret.toString('hex'));
    // console.log("Reading keys from file : ");
    // readKeyPairsFromFile();
}

async function fetchPostDetailsFromPostId(post_Id){
let obj = db.collection('posts');
let posterEmail, encryptedPost, iv, originalDigitalSignature, posterRSAPublicKey;
let isReponseObtained = await obj.get().then((query) => {
    query.forEach(doc => {
        if(doc.data().postId === post_Id){
            // console.log(doc.data());
            iv = doc.data().iv;
            posterRSAPublicKey = doc.data().posterRSAPublicKey;
            originalDigitalSignature = doc.data().digitalSignature;
            encryptedPost = doc.data().encryptedPost;
            posterEmail = doc.data().posterEmail;
        }
    });
});
return {encryptedPost, originalDigitalSignature, posterEmail, iv, posterRSAPublicKey};
}

function readStoreData_DB(){
    let obj = db.collection('users');
obj.get().then((queryS) => {
    queryS.forEach(doc => {
        console.log(doc.data());
    })
});

const data = {
    Id : 3,
    Name : "User3"
    };
    
    db.collection("users").doc(data.Id.toString()).set(data);
}