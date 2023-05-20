import { Box, Button } from "@chakra-ui/react";
import Post from "./Post";

export default function PostsList({posts}){
    return (
        <Box px="4" align="center">
            {
                // posts?.map((postData) => <Post key={postData.postId} value={postData}/>)
                posts?.map((postData) => {
                        console.log(postData.postId, postData);
                    return <Post key={postData.postId} pData={postData} userId={postData.userId}/>
                // return <Post key={postData.postId} val={postData}/>
                })

            //  posts?.map((postData) => {
            //     console.log("Data : "+postData.userId);
            //     const post = {
            //         uid: postData.userId, 
            //         data : postData.data
            //     };
            //     return
            //     (<Post display={post}/>);
            //     // <Post key={post.userId} postData={post.data}/>
            //  })
            }
        </Box>
    );
};