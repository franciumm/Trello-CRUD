import mongoose, { Schema , model  } from "mongoose";
const TaskSchema = new Schema({
    title :String,
    
    description : String,

    status:{enum:['toDo','doing','done'],default:'toDo',type:String},

    UID : { required : true, ref:'User', type: mongoose.Types.ObjectId},

    assignTo : { required : true, ref:'User', type: mongoose.Types.ObjectId},

    deadline:String
},{timestamps:true})

const taskModel = model('Task', TaskSchema);
export default taskModel;