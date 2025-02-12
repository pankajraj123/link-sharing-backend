import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

const Database = mongoose
  .connect(process.env.MONGODB_CONNECTION_URL)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((error) => {
    console.log(error);
  });

  export default Database;