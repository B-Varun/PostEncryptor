import { validateUserLogin } from '../../hooks/auth';
import { Box,Heading,Center,FormControl,FormLabel,Input,WrapItem,Text,Button } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { rsakeyPairGenerator } from "../RSAGenerator/RSAKeysGenerator";
// import DASHBOARD from '../PDS/SignUp';
import { DASHBOARD, SN_REGISTER } from '../RouterFile';

export default function Login(){

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const validateUser = async (event) => {
        event.preventDefault();
        const user = {
            userEmail : email,
            userPassword : password
        };
        let isLoggedIn = await validateUserLogin(user)
        console.log("Logged in :"+isLoggedIn);
        if(isLoggedIn){
           localStorage.setItem("userEmail", email);
           console.log('user');
           navigate(DASHBOARD);
           rsakeyPairGenerator();
        }
        else
        alert("User not registered");
    }

    return (
        <Center w="100%" h="100vh">
            <Box mx={1} maxW="md" p="9" borderWidth="1px" borderRadius="lg">
            {/* <Box margin="10%" bg="#33FF96" w="35%" color="black" p={4} borderWidth='1px' borderRadius='lg'> */}
                <Heading textAlign="center" mb="5" size='lg' fontSize="50px" as='h1'>SNE Login</Heading>

            <form onSubmit={validateUser}>
                <FormControl color="black" py="2">
                    <FormLabel>Email Address</FormLabel>
                    <Input type="email" placeholder="Enter your Email" onChange={(val) => setEmail(val.target.value)}/>
                </FormControl>
                <FormControl color="black" py="2">
                    <FormLabel>Password</FormLabel>
                    <Input type="Password" placeholder="Enter password" onChange={(psd) => setPassword(psd.target.value)}/>
                </FormControl>
                <WrapItem>
                  <Button py="3" size="lg" colorScheme='gray' type="submit">Submit</Button>
                </WrapItem>

                <Text>Not a registered user, Click to 
                {/* <Link color='purple' as={RouterLink} to={REGISTER}> Register</Link> */}
                </Text>
            </form>
            </Box>
        </Center>
    )};