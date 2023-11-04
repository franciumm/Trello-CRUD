import taskModel from "../../../../DB/models/Task.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import jwt  from "jsonwebtoken";
import mongoose from "mongoose";
import userModel from "../../../../DB/models/User.model.js";


export const TaskUpdate =asyncHandler(async(req,res,next)=>{
    const TaskId = req.params.Taskid;
    const {title,description,deadline,assignTo,status} = req.body;
    
    const  UID = req.UID;

    if ( !mongoose.Types.ObjectId.isValid(assignTo)) {
        return res.json("Invalid ids format");
    }
    
    const task=await taskModel.findById(TaskId);
    
    if(!task){
        return next(new Error('Task not found' , { cause :404}))
    }
    if(task.UID!=UID){return next(new Error('You are not the owner of the Task',{cause : 403}))}
    const user2 = await userModel.findOne({_id :assignTo});
    if(!user2 ){
        return next(new Error('Error In-valid User Assign To'), {cause:400});
    } 
    
    
    let timestamp1 = Date.parse(deadline);
    let timestamp2 = Date.parse(req.Today);
    if(timestamp2-timestamp1>0){
        return next(new Error('Deadline Isn`t Valid'));
    }
    
    
    const updateTask = await taskModel.findByIdAndUpdate(TaskId, {title,description,deadline,assignTo,status}, {new:true});
    res.status(200).json({Message :'Done' , updateTask});
    
});


export const DelTask = asyncHandler(async(req,res,next)=>{
    const UID = req.UID;
    const TaskId = req.params.taskid;
    const task=await taskModel.findById(TaskId);
    if(!task){
        return next(new Error('Task not found' , { cause :404}))
    }
    if(task.UID!=UID){return next(new Error('You are not the owner of the Task',{cause : 403}))}
    const deltask = await taskModel.findByIdAndDelete(TaskId);    
    const user = await userModel.findOne({_id :UID});
    user.createdtasks.pop(task.id);
    user.save();
    const user2 = await userModel.findById(task.assignTo);
    user2.Assignedtasks.pop(task.id);
    user2.save();
    res.status(200).json({Message : 'Done ', deltask});

})