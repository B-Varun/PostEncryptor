import { useState } from "react";
// import { db } from "../Firebase";
// import { setDoc, doc, query, collection } from "firebase/firestore";
// import { uuidv4 } from "@firebase/util";
// import {useCollectionData } from 'react-firebase-hooks/firestore';
import { loadPostsFromDB } from '../Components/Posts/posts';
import PostsList from "../Components/PostComponent/PostsList";

// export function useAddedpost(){
//     const [isLoading, setLoading] = useState(false);
//     async function addPost(post){
//         setLoading(true);
        
//         // This is required for creating a url for a object. Check if it will help us with our idea for a string.Check
//         // URL.createObjectURL();

//         // add docs by myself. document ref this is doc() 
//         // id is the doc id that we are generating and assigning to doc.
//         const id = uuidv4();
//         await setDoc(doc(db, "posts", id), {
//             ...post,
//             id:id,
//         });
//         setLoading(false);
//     }
//     return {addPost, isLoading};
// };

export async function usePosts(){
    // const [posts, isLoading, error] = useCollectionData(quer);


    // This should be enabled to fetch posts from DB. Commenting for now to avoid the errors 
    const posts = await loadPostsFromDB();

    // const posts = [];

    // console.log("Posts sent by server: "+posts);
    return posts;
    // if(error) throw error;
    // return {posts, isLoading};
}