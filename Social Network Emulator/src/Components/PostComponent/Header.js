import { Button, Box, Flex } from "@chakra-ui/react";
// import {useData, useDataForUserPost, useDataForUser, useDataForUserAndPost} from "../hooks/userData";

export default function Header({id}){
  // const {pid, text} = post;
  // const { user, isLoading } = useData(id);

  let userId = localStorage.getItem("userId");

  // if(isLoading)  return "Loading ... ";
return (
    <Flex
    alignItems="center"
    borderBottom="2px solid"
    borderColor="teal.100"
    p="3"
    bg="gray.50"
  >
<Box ml="4">
  <Button colorScheme="teal" variant="link">{userId}</Button>
</Box>
    </Flex>
);
}