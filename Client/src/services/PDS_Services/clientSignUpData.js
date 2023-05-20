export const clientSignUpData = (signUpData) => {
  // console.log("\n\n----------\n\nSignup : "+{signUpData});
    return fetch("http://localhost:4000/signUp",{
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({signUpData})
    }).then(res => res.text())
    .then(data => {
      console.log(data);
    }).catch((error) => {
      console.log('Error occured : ', error);
    });
};