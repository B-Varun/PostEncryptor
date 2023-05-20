import { Box, Text, Button } from "@chakra-ui/react";
import Header from '../PostComponent/Header';

export default function ViewPost({post}){

    console.log(post);
    return (
    <>
        <h1>Details of Post</h1>
        <Box p="2" maxW="600px" textAlign="left">
        <Box border="2px solid" borderColor="gray.100" borderRadius="md">
            {/* <Header id={userId}/> */}
            {/* <Header/> */}
          <Box p="2" minH="100px">
            <Text wordBreak="break-word" fontSize="md">
                {post}
              {/* To open a link in new tabusing the attribute targer="_blank"
              <a href={text} target="_blank" rel="noreferrer">text</a> */}
            </Text>
          </Box>
  
        </Box>
      </Box>
    </>
    );
}