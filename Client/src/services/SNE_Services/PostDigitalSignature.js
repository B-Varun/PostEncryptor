import { KJUR } from 'jsrsasign';
export async function calculateMessageDigest(post){
    // console.log("Post to calculate digest : "+post);
    let messageDigestObject = new KJUR.crypto.MessageDigest();
    messageDigestObject.setAlgAndProvider('sha256','cryptojs');
    messageDigestObject.updateString(post);
    let messageDigest = messageDigestObject.digest();
    // console.log("Digest of the post is : "+messageDigest);
    return messageDigest;
}

export async function encryptPostWithClientPrivateKey(messageDigest){
    let signatureCreator = new KJUR.crypto.Signature({"alg": "SHA256withRSA"});
    let rsaPrivateKey = localStorage.getItem("rsaPrivateKey"); 
    signatureCreator.init(rsaPrivateKey);
    signatureCreator.updateString(messageDigest);
    let signedPost = signatureCreator.sign();
    return signedPost; 
}

export async function validatePDSSharedPosts(messageDigest, serverResponse){
    let signatureValidator = new KJUR.crypto.Signature({"alg" : "SHA256withRSA"});
    let pubKey = localStorage.getItem("rsaPublicKey");
    signatureValidator.init(pubKey);
    signatureValidator.updateString(messageDigest);

    // signatureValidator.init(serverRSAPublicKey);
    // signatureValidator.updateString(messageDigest);   //update should have the digest of the message encrypted with shared key
    return signatureValidator.verify(serverResponse);   // We pass the dig sign sent by server for validating if it is changed or not.
}

export async function validatePDSViewerPostResponse(postDigest, response){
    let serverRSAPublicKey = response.rsaPubKey;
    let postDigSignature = response.digitalSignature;
    console.log("Post Digest : "+postDigest+"\n Response : ");
    console.log(serverRSAPublicKey, postDigSignature);
    let signatureValidator = new KJUR.crypto.Signature({"alg" : "SHA256withRSA"});
    signatureValidator.init(serverRSAPublicKey);
    signatureValidator.updateString(postDigest);
    let isPostAltered = signatureValidator.verify(postDigSignature);
    return isPostAltered;
}

export async function validatePost(plainTextPost, postDigest, response){
    let serverRSAPublicKey = response.rsaPubKey;
    let postDigSignature = response.digitalSignature;
    let pubKey = localStorage.getItem("rsaPublicKey");
    let signatureValidator = new KJUR.crypto.Signature({"alg" : "SHA256withRSA"});
    signatureValidator.init(serverRSAPublicKey);
    // signatureValidator.init(pubKey);
    // signatureValidator.updateString(postDigest);
    signatureValidator.updateString(plainTextPost);
    let isPostAltered = await signatureValidator.verify(postDigSignature);
    return isPostAltered;
}

/* 
export async function validate(plainTextPost, postDigest, response){
    let serverRSAPublicKey = response.rsaPubKey;
    let postDigSignature = response.digitalSignature;
    const importedKey = await crypto.subtle.importKey(
        'spki',
        serverRSAPublicKey,
        { name: 'RSA-PSS', hash: 'SHA-256' },
        true,
        ['verify']
      );

      console.log("Server RSA Public Key : ");
      console.log(importedKey);
  
      const isSignatureValid = await crypto.subtle.verify(
        { name: 'RSA-PSS', saltLength: 32 },
        importedKey,
        postDigSignature,
        plainTextPost
      );

      console.log("Signature valid or not "+isSignatureValid);
}  
*/