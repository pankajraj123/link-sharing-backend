const subscription=require('../model/subscription.model')
const topics= require('../model/topics')

exports.subscribed= async (req,res)=>{
    const {seriousness}=req.body;
    const {id}=req.params;
    const userid=req.user.user._id;
    console.log('hello  i am in subscribed ')
     try{
        const topicExist = await topics.findOne({ _id : id,visibility:'public'});
   console.log(topicExist.name)
  if(!topicExist)
{
    return res.status(404).json({message:"Topic not found "});
} 

  await subscription.create({
    topicId:id,
    userId:userid,
    seriousness:seriousness,
    createdAt:Date.now()
  })
   return res.status(200).json({message:"subscribed successfully",});
     }catch(error){
        console.log(error)
        return res.status(500).json({message:"internal server",error})
     }
   }

exports.getTotalSubscription= async(req,res)=>{
    const _id= req.user.user._id
    try{
      const data = await subscription.find({userId:_id});
      const subscribedlength=data.length;
      return res.status(200).json({message:'total subscrition fetched',count:subscribedlength})
    }catch(error){
      return res.status(500).json({message:"interval server",error})
    }
}
