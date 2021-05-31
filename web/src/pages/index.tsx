import { withUrqlClient } from "next-urql";
import React from "react";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/basic/Layout";

// const io = require("socket.io-client");
// const socket = io("https://api.example.com", {
//   withCredentials: true,
//   extraHeaders: {
//     "my-custom-header": "abcd"
//   }
// });

export function Home() {
  return (
    <div className="app">
      <Layout></Layout>
    </div>
  );
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Home);
