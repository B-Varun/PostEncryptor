import { useNavigate } from "react-router-dom";
import { SN_LOGIN } from '../Components/RouterFile';

export async function validateUserLogin(user){
    //Check for user in the DB
    return fetch("http://localhost:5000/login",{
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({user})
      }).then((res) => res.json()).
      then(data => {
        console.log(data);
        let status = data.status;
        console.log("status : "+status);
        if(status === "User logged in"){
          localStorage.setItem("userId", data.id);
          return true;
        }
        else {
          localStorage.removeItem("userId");
          return false;
        }
      });
        
      
        
        // Working without uid
      //   ) => {
      //   const userId = res.id;
      //   if(res.status == 200){
      //     console.log("Response : "+res.text());
      //     console.log("id : "+res.json().id);
      //     console.log("userId : "+userId);
      //     localStorage.setItem("userId", userId);
      //     return true;
      //   } 
      //   else 
      //   return false; 
      // });




        // body: JSON.stringify({signUpData})
      // }).then((res) => {
      //   const userId = res.id;
      //   if(res.status == 200){
      //     console.log("Response : "+res.text());
      //     console.log("id : "+res.json().id);
      //     console.log("userId : "+userId);
      //     localStorage.setItem("userId", userId);
      //     return true;
      //   } 
      //   else 
      //   return false; 
      // });





    // }).then(res => res.text())
    // .then(data => {
    //   console.log(data);
    // }).catch((error) => {
    //   console.log('Error occured : ', error);
    // });

};


export function useLogOut(){
  // const [signOut, isLoading, error] = useSignOut(auth);
  const navigate = useNavigate();
async function logout(){
// if(await signOut()){
  // Successfully logged out
  localStorage.removeItem("userId");
  localStorage.removeItem("rsaPublicKey");
  localStorage.removeItem("rsaPrivateKey");
  navigate(SN_LOGIN);
// }
}
return logout;
};
