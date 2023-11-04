import mongoose, { Schema , model  } from "mongoose";

const userSchema = new Schema ({
    userName :{
        type : String , 
        required : true ,
        unique : true
    }, 
    email:{
        unique:true ,       
        required : true ,
        type : String
    },
    password :{  
        required : true ,
        type : String
    },

    age: Number,
    gender :{
        type :String ,
        default:'male',
        enum:['male', 'female']
    },
    confirmEmail : {type : Boolean , default :false}
    ,phone : String,
    isonline :{type : Boolean , default :false},
    isdeleted : {type : Boolean , default :false},
    Assignedtasks : [{type : mongoose.Types.ObjectId , ref : 'Task'}],
    createdtasks : [{type : mongoose.Types.ObjectId , ref : 'Task'}]
}, {timestamps : true});

const userModel = model('User',userSchema)

export default userModel;