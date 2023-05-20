
export async function getDataFromPDS(PDSpostId){
    console.log("Button clicked : "+PDSpostId);
    let response = await getPostFromPDS(PDSpostId);
    // console.log("Post server response : ");
    // console.log("Enc Post : ",response.response.encPost, "\nIv : ",response.response.iv, "\n Digi Sign: ",response.response.digitalSignature, "\npub key : ",response.response.rsaPubKey);
    return response;
}



export const getPostFromPDS = async (postId) => {
    console.log("to fetch : "+postId);
    let email = localStorage.getItem("userEmail");
    let pubKey = localStorage.getItem("rsaPublicKey");
    let url = `http://localhost:4000/getPost?postId=${postId}&email=${email}&pubKey=${pubKey}`;
    // return fetch("http://localhost:4000/getPost/"+postId
    // let response = await fetch("http://localhost:4000/getPost?postId=${postId}&email=${email}&pubKey=${pubKey}"
    let responseData = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json()).
    then((data) => {
        // console.log("REtrieved post : ");
        // console.log(data);
        return data;
    });
    return responseData;
  };