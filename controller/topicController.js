const  topics= require ('../model/topics');
const user = require ('../model/users');

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

        res.status(201).json({ message: "Topic created successfully", topic: topicData });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

