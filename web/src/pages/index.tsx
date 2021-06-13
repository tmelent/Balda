import React from "react";
import { withApollo } from "src/utils/withApollo";
import { Layout } from "../components/basic/Layout";

// const io = require("socket.io-client");
// const socket = io("https://api.example.com", {
//   withCredentials: true,
//   extraHeaders: {
//     "my-custom-header": "abcd"
//   }
// });

export function Index() {  
  return (
    <div className="app">
      <Layout/>      
      
    </div>
  );
}

export default withApollo({ssr: true})(Index);
