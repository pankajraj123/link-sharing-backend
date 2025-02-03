const express= require('express');
const app= express();
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const userRouter=require('./routes/register');
const topicRouter= require('./routes/topic.route')
const subscribedRouter=require('./routes/subscribe.route')
const resourceRouter=require('./routes/resource.route')

const PORT= 8000;

const cors=require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.use("/",userRouter);
app.use("/",topicRouter);
app.use("/",subscribedRouter);
app.use("/",resourceRouter);


mongoose.connect('mongodb://localhost:27017/linksharing')
.then(()=>{
    console.log("database is connected")
})
.catch((error)=>{
    console.log(error)
})

 app.get('/',(req,res)=>{
  res.send("hello world");
 })

app.listen(PORT,(req,res)=>{
    console.log("hello i am at the port no 8000")
})