const resource=require("../model/resource.model");
const topics = require('../model/topics');

exports.createresource= async(req,res)=>{
    try{
   const  id= req.user.user._id;
   console.log(req.user.user)
   console.log(id)
    const {description}=req.body;
    console.log(description);
    const {topicId}= req.params;
   const topicdata=await topics.findById(topicId)
    if(!topicdata){
        return res.status(404).json({message:"Topic not found"});
    }
    const resourcedata=new resource({
        description:description,
        topic:topicId,
        createdby:id,
        dateCreated:Date.now(),
        lastUpdated:Date.now(),
    }) 
    console.log(resourcedata);
    await resourcedata.save();
    return res.status(200).json({"resourceData":resourcedata,message:"resource created successfully"});
    }catch(error){
        console.log(error);
       return res.status(500).json({message:"internal server error"})
    }
}