import { JSEncrypt } from "jsencrypt";

export async function rsakeyPairGenerator(){
    await generateKeys();
};

const generateKeys = async () => {
    const keyGenerator = new JSEncrypt();
    const keyPair = keyGenerator.getKey();
    let privateKey = keyPair.getPrivateKey();
    let publicKey = keyPair.getPublicKey();
    localStorage.setItem("rsaPublicKey", publicKey);
    localStorage.setItem("rsaPrivateKey", privateKey);
    return {publicKey, privateKey};
};