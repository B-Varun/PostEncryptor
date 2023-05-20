import { Button, Flex, Link } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom" 
import { DASHBOARD } from "./RouterFile"
import { useLogOut } from "../hooks/auth";

export default function Navbar(){
    // const { logout, isLoading } = useLogOut();
    const logout = useLogOut();
    return (<Flex
        shadow="sm"
        pos="fixed"
        width="full"
        borderTop="6px solid"
        borderTopColor="teal.400"
        height="10"
        zIndex="3"
        justify="center"
        bg="blue"
      >
           <Flex px="4" bg="purple" w="full" align="center" maxW="1000px">
           <Link color="teal" as={RouterLink} to={DASHBOARD} fontWeight="bold">
              Home
           </Link>

           <Button
          ml="auto"
          colorScheme="teal"
          size="sm"
          onClick={logout}
          // isLoading={isLoading}
        >
          Logout
        </Button>
           </Flex>
        </Flex>
)
};