import { Box, Text, Button } from "@chakra-ui/react";
import Header from './Header';
import { getDataFromPDS } from '../../services/SNE_Services/ViewPostData';
import { calculateMessageDigest, validatePDSViewerPostResponse, validatePost } from '../../services/SNE_Services/PostDigitalSignature';
import { decryptPostData } from '../../services/SNE_Services/PostClientData';
import  ViewPost from '../Posts/ViewPost';
import React from 'react';
import ReactDOM from 'react-dom';

  export default function Post({pData}){
    const { postId, userId, data } = pData;
    console.log(postId, userId, data);

    async function viewPost(){
      let serverResponse = await getDataFromPDS(data);
      // console.log("serverResponse : ");
      // console.log(serverResponse.response);
      let iv = serverResponse.response.iv;
      // console.log("iv : "+iv);
      let encryptedPostData = serverResponse.response.encPost;
      // decr post with user shared key.
      // console.log("Message After decryption : ");
      let decryptedPostData = await decryptPostData(encryptedPostData, iv);
      // console.log("After decryption, data is: "+decryptedPostData);
      let postDigest = await calculateMessageDigest(decryptedPostData);
      // console.log("Post Digest : "+postDigest);
      // let isOwnerPostedPost = await validatePDSViewerPostResponse(postDigest, serverResponse.response);
      let isOwnerPostedPost = await validatePost(decryptedPostData, postDigest, serverResponse.response);
      console.log("The post is not altered : "+isOwnerPostedPost);

      if(isOwnerPostedPost){
        const newWindow = window.open('', '_blank');

        // Render the ViewPost component in the new window/tab
        newWindow.document.write('<div id="root"></div>');
        ReactDOM.render(
          <React.StrictMode>
            <ViewPost post={decryptedPostData} />
          </React.StrictMode>,
          newWindow.document.getElementById('root')
        );        
      }
      // Display the post to the client on a new screen.
      // return (<ViewPost post={decryptedPostData}/>);
    }

    return (
        <Box p="2" maxW="600px" textAlign="left">
        <Box border="2px solid" borderColor="gray.100" borderRadius="md">
            <Header id={userId}/>
          <Box p="2" minH="100px">
            <Text wordBreak="break-word" fontSize="md">
              Click to view Post : <Button onClick={viewPost}>{data}</Button>
              {/* To open a link in new tabusing the attribute targer="_blank"
              <a href={text} target="_blank" rel="noreferrer">text</a> */}
            </Text>
          </Box>
  
        </Box>
      </Box>      
    );
};