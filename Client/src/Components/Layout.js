import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SN_LOGIN as LOGIN } from "./RouterFile";
import { useAuth } from "../hooks/auth";
import Navbar from './Navbar';

export default function Layout(){

const {pathname} = useLocation();
const navigate = useNavigate();
// const {user, isLoading} = useAuth();

//If path name / user changes run all the code inside the hook
useEffect(() => {
    const id = localStorage.getItem("userId");
    // if(!isLoading && 
        if(pathname.startsWith("/sne/user") && !id){
        //  && !user){
        navigate(LOGIN);
    }
}, [pathname])
//, user, isLoading]);

// if(isLoading)
// return "Loading...";

    return (
        <>
            <Navbar/>
            <Outlet/>
        </>
    );
};