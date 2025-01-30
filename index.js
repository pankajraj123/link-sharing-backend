const express= require('express');
const app= express();
const mongoose = require('mongoose');
 const router=require('./routes/register');
const PORT= 8000;
const cors=require('cors');

app.use(cors());

app.use(express.json());

app.use("/",router);

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