const  topics= require ('../model/topics');

exports.createTopic= async (req,res)=>{
    try{
       const { name,visibility }=req.body;
       console.log(req.body)
       console.log('HII')
       if(!name || !visibility){
        return res.send("All Fields are Required")
       }

       const isExist=await topics.findOne({name});

       if(isExist){
        return res.send("Topic Already Exist");
       }
    let topicData=new topics({
        name:name,
        visibility:visibility
       })
    await topicData.save();
       res.send("topic created",topicData)
    console.log("hello ")
    }catch(error){
       res.send(error);
    }
}

exports.getTopic=async(req,res)=>{
    try{
       const topic=await topics.find();
       res.send(topic);
    }catch(error){
     res.send("topic not get sucessfully");
    }
}