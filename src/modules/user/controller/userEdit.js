import userModel from "../../../../DB/models/User.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../../../utils/errorHandling.js";
import jwt  from "jsonwebtoken";
import bycrypt from 'bcrypt';

export const UserUpdate = asyncHandler(async (req,res,next)=>{
    const { userName,age , phone  }= req.body;
    const  UID = req.UID;
    const userUpdate = await userModel.findOneAndUpdate({$or :[{userName},{_id : UID}]}, {phone ,age}, {new:true})
        res.status(200).json(userUpdate);
}
)
export const UserDelete =asyncHandler( async (req,res,next)=>{
    const {userName}= req.body ;
    const {token} = req.headers;
    let id = jwt.verify(token ,process.env.NORMAL_TOKEN_SIG).id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.json("Invalid id format");
    }
    const user = await userModel.findOne(
        {$or :[{userName},{_id :id}]});
    
    if(!user ){
            return next(new Error('Error In-valid Data'), {cause:400});
    }
    if(!user.isonline){return next(new Error('Login First',{cause : 200}))}
    
    let deleteuser =await  userModel.findOneAndDelete({_id : id})
    res.json(deleteuser);

})



export const passchange =asyncHandler( async(req,res,next)=>{


    const {oldPassword,newPassword,cPassword}=req.body;
    const  UID = req.UID;
    if(newPassword != cPassword){
        return next( Error('Passwords Doesn`t match'), {cause:403});
    }

const user =req.user;


const match = bycrypt.compareSync(oldPassword, user.password);

if(!match){
    return next(new Error('Invalid Password',{cause : 401}))
}
const match2 = bycrypt.compareSync(newPassword, user.password);
if(match2){
    return next(new Error('write new Password ',{cause : 401}))
}

    const hashPassword = bycrypt.hashSync(newPassword, parseInt(process.env.HASH_ROUNDS));
    const userUpdate = await userModel.findOneAndUpdate({_id : UID}, {password:hashPassword},{new:true});
    res.status(200).json(userUpdate)
});



export const UserLogout = asyncHandler(async(req,res,next)=>{
    const {token} = req.headers;
    const  UID = jwt.verify(token, process.env.NORMAL_TOKEN_SIG).id;
    const user =await  userModel.findById(UID);

    if(!user){
        return next(new Error('User Not Found' ,{cause : 404}))
    }
    const userUpdate = await userModel.findOneAndUpdate({_id : UID}, {isonline: false});
    return res.json('Done')

})



export const sofDelete = asyncHandler(async(req,res,next)=>{
    const {token} = req.headers;
    const id = jwt.verify(token,process.env.NORMAL_TOKEN_SIG).id;
    const user =await  userModel.findById(id);
    if(!user){
        return next(new Error('User Not Found' ,{cause : 404}))
    }
    const sofdel = await userModel.findByIdAndUpdate({_id:id} , {isdeleted:true},{new:true}) ;
    res.json(sofdel);


})