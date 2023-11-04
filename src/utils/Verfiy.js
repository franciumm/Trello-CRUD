import jwt  from "jsonwebtoken";
import mongoose from "mongoose";
import userModel from "../../DB/models/User.model.js";
import { asyncHandler } from "./errorHandling.js";


export const verifytoken =asyncHandler(async (req,res,next)=>{
    const {token} = req.headers;

    if(!token){
        return next(new Error('Token Is Required',{casue : 401}))
    }
    
    const UID = jwt.verify(token,process.env.NORMAL_TOKEN_SIG).id;
    if(!UID){
        return next(new Error('In-valid Token ',{casue : 400}))
    }
    if (!mongoose.Types.ObjectId.isValid( UID)) {
        return res.json("Invalid id format");
    }

    const user = await userModel.findOne({_id : UID},{},{new:true});
    if (!user) {
        return next(new Error('User Not Found'),{cause : 404});
    }
    if(user.isdeleted ){return next(new Error('This Email is deleted Please Login Again ', {cause : 400}))}
    if(!user.isonline){return next(new Error('Login First',{cause : 401}))}
    req.user = user
    req.UID = UID
    next()
})

