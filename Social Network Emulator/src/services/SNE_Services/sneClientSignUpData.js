export const sne_ClientSignUpData = (userCredentials) => {
return fetch("http://localhost:5000/signUp",{
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({userCredentials})
    }).then(res => res.text())
    .then(data => {
      console.log(data);
    }).catch((error) => {
      console.log('Error occured : ', error);
    });
};