function addPostDataToSNEDB(userId, pdsPostId){
    fetch("http://localhost:5000/addPost",{
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({userId, pdsPostId})
    }).then(res => res.text())
    .then(data => {
      console.log(data);
    }).catch((error) => {
      console.log('Error occured : ', error);
    });
}

export async function registerPostForUser(pdsPostId){
    let userId = localStorage.getItem("userId");
    await addPostDataToSNEDB(userId, pdsPostId);
}