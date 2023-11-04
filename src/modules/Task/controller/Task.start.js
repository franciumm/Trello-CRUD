import { asyncHandler } from "../../../utils/errorHandling.js";
import userModel from "../../../../DB/models/User.model.js";
import taskModel from "../../../../DB/models/Task.model.js";



export const addTask = asyncHandler(
    async (req,res,next)=>{
        const {title,description,deadline,assignTo} = req.body;
        const  UID = req.UID;
        const user = req.user;
        const user2 = await userModel.findOne({_id :assignTo},{new:true});
        if(!user2 ){
            return next(new Error('Error In-valid User Assign To'), {cause:400});
        } 
        let timestamp1 = Date.parse(deadline);
        let timestamp2 = Date.parse(req.Today);
        
    if(timestamp2-timestamp1>0){
        return next(new Error('Deadline Isn`t Valid'));
    }
    const addTasks= await taskModel.create({title,description,deadline:timestamp1,assignTo,UID});
    if (!user2.Assignedtasks) {
        user2.Assignedtasks = []; 
    }
    if (!user.createdtasks) {
        user2.createdtasks = []; 
    }
    user2.Assignedtasks.push(addTasks._id);
    await  user2.save();
    user.createdtasks.push(addTasks._id);
    await user.save();
    res.status(200).json({ message: 'Added', user2: user, task: addTasks });

    }
)