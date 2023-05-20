import { createDiffieHellman, getDiffieHellman } from "diffie-hellman/browser";
import { Buffer } from 'buffer';
global.Buffer = Buffer;
const dh = getDiffieHellman("modp14");
const diffieHellman = createDiffieHellman(dh.getPrime(), dh.getGenerator());

const generateDiffieHellmanKeyPair = () => {
  diffieHellman.generateKeys();
  const publicKey = diffieHellman.getPublicKey().toString("hex");
  const privateKey = diffieHellman.getPrivateKey().toString("hex");
  return { publicKey, privateKey };
};

export const computSharedKey = (serverPubKey) => {
  const diffieHellman = createDiffieHellman(dh.getPrime(), dh.getGenerator());

  const dhPriv = localStorage.getItem("dhPrivateKey");
  const dhPub = localStorage.getItem("dhPublicKey");

  diffieHellman.setPrivateKey(Buffer.from(dhPriv, "hex"));
  diffieHellman.setPublicKey(Buffer.from(dhPub, "hex"));

  const shared = diffieHellman.computeSecret(
    Buffer.from(serverPubKey, "hex"),
    null,
    "hex"
  );

  localStorage.setItem("sharedSecretKey", shared.toString('hex'));
  // console.log("Shared Secret : "+shared.toString('hex'));

  return shared;
};

export const generateDH = () => {
  if (
    !localStorage.getItem("dhPrivateKey") ||
    !localStorage.getItem("dhPublicKey")
  ) {
    const keyPair = generateDiffieHellmanKeyPair();

    localStorage.setItem("dhPrivateKey", keyPair.privateKey);
    localStorage.setItem("dhPublicKey", keyPair.publicKey);
  }
};
