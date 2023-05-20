import { createBrowserRouter } from "react-router-dom";
import SNE_Login from './SNE/SNELogin';
import PDS_SignUp from './PDS/SignUp';
import SNE_SignUp from './SNE/SignUp';
import DashBoard from "./UserDashBoard.js/DashBoard";
import Layout from './Layout';

export const ROOT = "/";
export const PDS_SIGNUP = "/pds/register";
export const PDS_LOGIN = "/pds/login";
export const SN_LOGIN = "/sne/login";
export const SN_REGISTER = "/sne/register";
export const USER = "/sne/user";
export const DASHBOARD = "/sne/user/dashboard";


export const router = createBrowserRouter([
    {path:ROOT, element:"Public Route"},
    {path: PDS_SIGNUP, element:<PDS_SignUp/>},
    {path:PDS_LOGIN, element:"PDS Login"},
    {path:SN_REGISTER, element:<SNE_SignUp/>},
    {path:SN_LOGIN, element:<SNE_Login/>},
    // {path : DASHBOARD, element:<DashBoard/>},
    {path:USER, element:<Layout/>, children:[
        {
            path:DASHBOARD, element:<DashBoard/>
        }
    ]}
]);
