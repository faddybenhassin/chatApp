import Message from "../models/message.model.js";
import User from "../models/user.model.js";



export async function getUsersForSideBar(req,res){
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({_id:{$ne: loggedInUser}}).select("-password");
        if(!filteredUsers || filteredUsers.length === 0){
            return res.status(404).json({ error: "no users found" });
        }
        
        res.status(200).json(filteredUsers);
    } catch (err) {
        console.error("Error in getUsersForSidebar: ", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
}