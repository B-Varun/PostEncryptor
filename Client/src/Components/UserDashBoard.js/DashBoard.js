import { Box, Button, HStack, Heading, Textarea } from "@chakra-ui/react";
import { useState } from "react"; 
import PostsList from "../PostComponent/PostsList";
import { usePosts } from '../../hooks/posts';
import { calculateMessageDigest, encryptPostWithClientPrivateKey, validatePDSSharedPosts } from '../../services/SNE_Services/PostDigitalSignature';
import { encryptPostData, clientDataPostService } from '../../services/SNE_Services/PostClientData';
import { addPostDataToSNEDB, registerPostForUser } from '../../services/SNE_Services/SNEPosts';
import { loadPostsFromDB } from '../../Components/Posts/posts';
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DASHBOARD } from '../../Components/RouterFile';
function UserPost(){
    // const {register, handleSubmit, reset} = useForm();
// const {addPost, isLoading: addNewPost} = useAddedpost();
// const {user, isLoading: authLoading} = useAuth();
const [postData, setPostText] = useState("");

async function submitPost(event){
    event.preventDefault();
    let posts = [];
    // console.log(data);
    // console.log("Entered post value : "+postData);
    let messageDigest = await calculateMessageDigest(postData);
    // console.log("Message digest : "+messageDigest);
    let digitalSignature = await encryptPostWithClientPrivateKey(messageDigest);
    // console.log("Digital Signature of the post : "+digitalSignature);
    // let { sharedSecretEncryptedPostInBase64, ivBase64 } = await encryptPostData(postData);
    let { ciphertextBase64:sharedSecretEncryptedPostInBase64, ivBase64 } = await encryptPostData(postData);
    let postIdFromPDS = await clientDataPostService(
        sharedSecretEncryptedPostInBase64,
        digitalSignature,
        ivBase64
         );

         console.log("Digi sign : "+digitalSignature);

         if(postIdFromPDS)
             posts = await registerPostForUser(postIdFromPDS);

    // To check if digital signature is valid or not     
    // let isModified = await validatePDSSharedPosts(messageDigest, digitalSignature);

    setPostText('');
    let textBox = document.getElementById("postBox");
    textBox.value="";
}
return (
    <Box maxW="500px" mx="auto" py="20">
        <form onSubmit={submitPost}>
            <HStack justify="space-between">
                <Heading size="lg">New Post</Heading>
                {/* <Button colorScheme='tomato' variant='outline' type="submit" isLoading={authLoading || addNewPost}>POST</Button> */}
                <Button colorScheme='tomato' variant='outline' type="submit">POST</Button>
            </HStack>
            <Textarea id="postBox" resize="none" mt="5" placeholder="Your new Post" onChange={(val) => {setPostText(val.target.value)}}/>
            {/* <Textarea resize="none" mt="5" placeholder="Your new Post" {...register("text")}/> */}
        </form>
    </Box>
);
}


export default function DashBoard(){
    const [posts, setPosts] = useState([]);
    async function loadPosts(){
        const postArray = await loadPostsFromDB();
        setPosts(postArray);
        console.log("posts array is :"+posts);
    }
return (
    <>
    <UserPost/>
    <Button mx="50px" py="5" size="sm" onClick={loadPosts}>Refresh</Button>
     <PostsList posts={posts}/>
     </>
);
}