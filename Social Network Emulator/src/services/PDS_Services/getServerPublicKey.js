export const getServerPublicKey = () => {
  return fetch("http://localhost:4000/pubKey", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.text());
};