import { asyncHandler } from "../../../utils/errorHandling.js";
import taskModel from "../../../../DB/models/Task.model.js";


export const getAllTasks=asyncHandler(async(req,res,next)=>{

    const tasks =await  taskModel.find().populate('UID','email userName').populate('assignTo','email userName');
    res.json({tasks})
});




export const GetCreatedTasks= asyncHandler(async(req,res,next)=>{
    
    const UID = req.UID;
    
    const Tasks =await taskModel.find({UID}).populate('UID','email userName').populate('assignTo','email userName');
    res.status(200).json(Tasks);

});

export const GetAssignedTasks = asyncHandler(
    async(req,res,next)=>{
        
        const UID = req.UID;
        
        const Tasks =await taskModel.find({assignTo:UID}).populate('UID','email userName').populate('assignTo','email userName');
        res.status(200).json(Tasks)
    }
);


export const GetLateTasks = asyncHandler(
    async(req,res,next)=>{
        let timestamp2 = Date.parse(req.Today);
        const Tasks =await taskModel.find({deadline :{$lt:timestamp2}}).populate('UID','email userName').populate('assignTo','email userName');
        res.json(Tasks)
    }
);

export const getTasksAssignToAnyUser = asyncHandler(
    async(req,res,next)=>{
    const id = req.params.id;
    

    const tasks =await  taskModel.find({assignTo:id}).populate('UID','email userName').populate('assignTo','email userName');
    res.status(200).json({message:'Done',tasks})    
}
)



