import { testConn } from "./testConn";

testConn(true)
  .then(() => process.exit())
  .catch((error) => console.log(error.message));
