import resource from '../model/resource.model.js'
import topics from '../model/topics.js'
import {v4 as uuidv4} from 'uuid'


export const createresource = async (req, res) => {
    try {
        const id = req.user.user._id;
        const { description } = req.body;
        const { topicId } = req.params;

        if (!description || !topicId) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const topicdata = await topics.findById(topicId)
        if (!topicdata) {
            return res.status(404).json({ message: "Topic not found" });
        }

        const resourcedata = new resource({
            uuid:uuidv4(),
            description: description,
            topic: topicId,
            createdby:id,
            dateCreated: Date.now(),
            lastUpdated: Date.now(),
        })

        await resourcedata.save();
        return res.status(200).json({ "resourceData": resourcedata, message: "resource created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" })
    }
}