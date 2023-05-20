import { Box, Heading, Center, FormControl, FormLabel,Input, WrapItem, Link, Text, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { sne_ClientSignUpData } from "../../services/SNE_Services/sneClientSignUpData";
import { useNavigate } from "react-router-dom";
import { DASHBOARD } from '../RouterFile';
import { useState } from "react";

export default function SignUp(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    // const {register: signUp, isLoading} = useRegister();
        // const {register, handleSubmit, formState:{errors}} = useForm();
    
        // async function formRegisterHandler(data){
        //     //invoke signup() from useRegister hook
        //     signUp({
        //         username: data.username,
        //         email : data.email,
        //         password : data.password,
        //         redirectTo:DASHBOARD
        //     });
        // };
    
        const submitUserData = async(event) => {
            event.preventDefault();
            console.log("Email : "+email+"\n Password : "+password);

            const user = {
                userEmail : email,
                userPassword : password
            };

            const receivedData = await sne_ClientSignUpData(user);
            navigate(DASHBOARD);
        };


        return (
            <Center w="100%" h="100vh">
                <Box mx={1} maxW="md" p="9" borderWidth="1px" borderRadius="lg">
                {/* <Box margin="10%" bg="#33FF96" w="35%" color="black" p={4} borderWidth='1px' borderRadius='lg'> */}
                    <Heading textAlign="center" mb="5" size='lg' fontSize="50px" as='h1'>SNE Sign Up</Heading>
    
                <form onSubmit={submitUserData}>
                    <FormControl color="black" py="2">
                        <FormLabel>Email Address</FormLabel>
                        <Input type="email" placeholder="Enter your Email" onChange={(val) => {setEmail(val.target.value)}}/>
                    </FormControl>
                    <FormControl color="black" py="2">
                        <FormLabel>Password</FormLabel>
                        <Input type="Password" placeholder="Enter password" onChange={(val) => {setPassword(val.target.value)}}/>
                    </FormControl>
                    <WrapItem>
                      <Button py="3" size="lg" colorScheme='teal' type="submit">Register</Button>
                    </WrapItem>
                </form>
                <Text>Already a registered user, Click to 
                    {/* <Link color='purple' as={RouterLink} to={LOGIN}> Login</Link> */}
                    </Text>
                </Box>
            </Center>
        );
    }
