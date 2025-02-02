const  topics= require ('../model/topics');
const user = require ('../model/users');
const subscription= require('../model/subscription.model')
exports.createTopic = async (req, res) => {
    try {
      
        const { name, visibility,} = req.body;
        const id= req.user.user._id;
        if (!name || !visibility || !id) {
            console.log("hello");
            return res.status(400).json({ message: "All Fields are Required" });
        }
        const isExist = await topics.findOne({ name });

        if (isExist) {
            return res.status(409).json({ message: "Topic Already Exists" });
        }

        let topicData = new topics({
            name: name,
            visibility: visibility,
            createdby: id,
        });
        await topicData.save();

        await subscription.create({
            topicId: topicData._id,
            userId:id,
            seriousness:"Casual",
            createdAt:Date.now()
        })
        res.status(201).json({ message: "Topic created successfully", topic: topicData });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.getUserTopics = async (req, res) => {
    const userid = req.user.user._id;
    try {
      const topiclist = await topics.find({ createdby: userid });
  
      let topicsDetails = []; 
  
      if (topiclist.length > 0) {  
        topicsDetails = topiclist.map((topic) => ({
          name: topic.name,
          visibility: topic.visibility,
          dateCreated:topic.dateCreated,
        }));
      }
      console.log('i am in topic get ')
      return res.status(200).json({
        totalTopic:topiclist.length,
        topic: topicsDetails,
        message: "Topics fetched successfully",
      });
    } catch (error){
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  
