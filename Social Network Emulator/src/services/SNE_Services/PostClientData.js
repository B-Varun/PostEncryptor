import CryptoJS from "crypto-js";

export async function encryptPostData(postData){
    let dhSharedSecret = localStorage.getItem("sharedSecretKey");
    const secretInBytes = CryptoJS.enc.Hex.parse(dhSharedSecret.toString('hex'));
    const iv = CryptoJS.lib.WordArray.random(16);
    const ciphertext = CryptoJS.AES.encrypt(postData, secretInBytes, { iv: iv });
    const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
    const ciphertextBase64 = ciphertext.toString();
    return { ciphertextBase64, ivBase64 };
}

export async function decryptPostData(encryptedPost, iv){
    console.log("iv : "+iv);
    let dhSharedSecret = localStorage.getItem("sharedSecretKey");
    const secretInBytes = CryptoJS.enc.Hex.parse(dhSharedSecret);
    // const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
    const ivWordArray = CryptoJS.enc.Base64.parse(iv);
    let plainText = CryptoJS.AES.decrypt(
        encryptedPost,
        secretInBytes,
        { iv: ivWordArray, mode: CryptoJS.mode.CBC }
        );
        plainText = plainText.toString(CryptoJS.enc.Utf8);
        return plainText;
}

export async function clientDataPostService(encPostBase64, digitalSignature, ivBase64){
    let rsaPublicKey = localStorage.getItem("rsaPublicKey");
    let email = localStorage.getItem("userEmail");
    // console.log(rsaPublicKey, email);
    const post = {
        encryptedPost : encPostBase64, 
        digiSign : digitalSignature,
        iv : ivBase64,
        userEmail : email,
        rsaPubKey : rsaPublicKey
    };
    let pdsResponse = await postDataToPDS(post);
    console.log("REsponse after submitting post : "+pdsResponse);
    return pdsResponse;
};

export const postDataToPDS = async (clientResponse) => {
    let postId =  fetch("http://localhost:4000/addNewPost",{
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({clientResponse})
    }).then(res => res.json())
    .then(data => {
        let id = data.postId;
      console.log("++++++++++++++++"+id);
      return id;
    }).catch((error) => {
      console.log('Error occured : ', error);
    });
    return postId;
};