const  topics= require ('../model/topics');

exports.createTopic = async (req, res) => {
    try {
        const { name, visibility } = req.body;

        if (!name || !visibility) {
            return res.status(400).json({ message: "All Fields are Required" });
        }

        const isExist = await topics.findOne({ name });

        if (isExist) {
            return res.status(409).json({ message: "Topic Already Exists" });
        }

        let topicData = new topics({
            name: name,
            visibility: visibility
        });

        await topicData.save();

        res.status(201).json({ message: "Topic created successfully", topic: topicData });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.getTopic=async(req,res)=>{
    try{
       const topic=await topics.find();
       res.send(topic);
    }catch(error){
     res.send("topic not get sucessfully");
    }
}