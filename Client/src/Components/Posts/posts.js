export async function loadPostsFromDB(){
  let posts = [];
    const postArray = await fetch("http://localhost:5000/getAllPosts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => response.json()
      ).then((data) => {
        data.forEach(
          (singlePost) => {
            console.log(singlePost);
            posts.push(singlePost);
          });
      });
    return posts;
}