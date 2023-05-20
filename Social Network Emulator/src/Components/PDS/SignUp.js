import {Box,Heading,Center,FormControl,FormLabel,Input,WrapItem,Link,Text,Button,} from "@chakra-ui/react";
import { useState } from "react";
import CryptoJS from "crypto-js";
import { getServerPublicKey } from "../../services/PDS_Services/getServerPublicKey";
import { computSharedKey } from "../../Diffie-Hellman/diffiehellman";
import { clientSignUpData } from "../../services/PDS_Services/clientSignUpData";
import { useNavigate } from "react-router-dom";
import { SN_REGISTER } from '../RouterFile';

// import { Link as RouterLink } from "react-router-dom";
// import { DASHBOARD, LOGIN } from './RouterFile';
// import { useForm } from "react-hook-form";

export default function SignUp(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [encryptedUserPassword, setEncUserPassword] = useState("");
  const navigate = useNavigate();

  async function formRegisterHandler(data) {
    //invoke signup() from useRegister hook
    // signUp({
    //     username: data.username,
    //     email : data.email,
    //     password : data.password,
    //     // redirectTo:DASHBOARD
    // });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const pubKey = await getServerPublicKey();
    console.log("Email : " + email + "\nPassword : " + password);
    let sha = computSharedKey(pubKey).toString('hex');
    console.log("Computed Shared SEcret : "+sha);
    // console.log("Secret : "+sha.toString('hex'));
    const clientPubKey = localStorage.getItem("dhPublicKey");
    // console.log("Shared Secret : "+sha.toString('hex'));
    const secretInBytes = CryptoJS.enc.Hex.parse(sha.toString('hex'));
    const iv = CryptoJS.lib.WordArray.random(16);
    // console.log("Iv word array :", iv.toString());
    const ciphertext = CryptoJS.AES.encrypt(password, secretInBytes, { iv: iv });
    // console.log("CipherTetx : "+ciphertext);
    // const ciphertext = CryptoJS.AES.encrypt(password, secretInBytes,iv);
    // Convert the IV and ciphertext to base64-encoded strings for transport
    const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
    // const ciphertextBase64 = ciphertext;
    // const ciphertextBase64 = btoa(ciphertext);
    // const ciphertextBase64 = ciphertext.toString(CryptoJS.enc.Base64);
    const ciphertextBase64 = ciphertext.toString();

    // Send the IV and ciphertext to the server for decryption
    // console.log("IV: " + ivBase64);
    // console.log("Ciphertext to String: " + ciphertextBase64);

    const signUpData = {
        userEmail : email,
        // passwd : ciphertext,
        passwd : ciphertextBase64,
        cliPubKey : clientPubKey,
        iv: ivBase64
    };
    const isSignUpSuccess = await clientSignUpData(signUpData);
    navigate(SN_REGISTER);
    // const isSignUpSuccess = await clientSignUpData(clientPubKey);
  };

  return (
    <Center w="100%" h="100vh">
      <Box mx={1} maxW="md" p="9" borderWidth="1px" borderRadius="lg">
        {/* <Box margin="10%" bg="#33FF96" w="35%" color="black" p={4} borderWidth='1px' borderRadius='lg'> */}
        <Heading textAlign="center" mb="5" size="lg" fontSize="50px" as="h1">
          PDS Sign Up
        </Heading>

        {/* <form onSubmit={handleSubmit(formRegisterHandler)}> */}
        <form onSubmit={handleSubmit}>
          <FormControl color="black" py="2">
            <FormLabel>Email Address</FormLabel>
            <Input
              type="email"
              placeholder="Enter your Email"
              onChange={(val) => setEmail(val.target.value)}
            />
          </FormControl>
          <FormControl color="black" py="2">
            <FormLabel>Password</FormLabel>
            <Input
              type="Password"
              placeholder="Enter password"
              onChange={(psd) => setPassword(psd.target.value)}
            />
          </FormControl>
          <WrapItem>
            <Button py="3" size="lg" colorScheme="teal" type="submit">
              Register
            </Button>
          </WrapItem>
        </form>
        {/* <Text>Already a registered user, Click to  */
        /* <Link color='purple' as={RouterLink} to={LOGIN}> Login</Link> */
        /* </Text> */}
      </Box>
    </Center>
  );
}
