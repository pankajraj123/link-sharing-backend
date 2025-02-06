import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/register.js';  
import topicRouter from './routes/topic.route.js';  
import subscribedRouter from './routes/subscribe.route.js';  
import resourceRouter from './routes/resource.route.js';  
dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", userRouter);
app.use("/", topicRouter);
app.use("/", subscribedRouter);
app.use("/", resourceRouter);

mongoose.connect('mongodb://localhost:27017/linksharing')
  .then(() => {
    console.log("Database is connected");
  })
  .catch((error) =>{
    console.log(error);
  });

app.get('/', (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, ()=>{
  console.log(`Server is running on port ${process.env.PORT}`);
});
