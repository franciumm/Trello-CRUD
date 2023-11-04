import jwt  from "jsonwebtoken";
import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import bycrypt from 'bcrypt';
import CryptoJS from 'crypto-js'
import SendMail from '../../../utils/Mailer.js'

export const UserSignUp = asyncHandler( async(req,res,next)=>{

    const {email,userName,password,age , gender ,phone,cPassword}= req.body ;


    const Phoneenc= CryptoJS.AES.encrypt(phone.toString(), process.env.PHONE_SIG).toString();
    
    const Srchusers= await userModel.findOne({$or :[{userName},{email}]});
    
    if(Srchusers != null){
        return next( Error('User Exists'), {cause:409});
    }
    if(password != cPassword){
        return next( Error('Password Doesn`t match'), {cause:403});
    }
    
    
    const hashPassword = bycrypt.hashSync(password, parseInt(process.env.HASH_ROUNDS));
    const creatUser =await  userModel.create({email, userName,password : hashPassword,age ,gender,phone:Phoneenc });
    const token = jwt.sign({ id: creatUser._id, email: creatUser.email }, process.env.EMAIL_SIG, { expiresIn: 60 * 5 });
    const newConfirmEmailToken = jwt.sign({ id: creatUser._id, email: creatUser.email }, process.env.EMAIL_SIG);

        const link = `${req.protocol}://${req.headers.host}/user/confirmEmail/${token}`
        const requestNewEmailLink = `${req.protocol}://${req.headers.host}/user/newConfirmEmail/${newConfirmEmailToken}`
        const html = `<!DOCTYPE html>
        <html>
        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
        <style type="text/css">
        body{background-color: #88BDBF;margin: 0px;}
        </style>
        <body style="margin:0px;"> 
        <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
        <tr>
        <td>
        <table border="0" width="100%">
        <tr>
        <td>
        <h1>
            <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
        </h1>
        </td>
        <td>
        <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td>
        <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
        <tr>
        <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
        <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
        </td>
        </tr>
        <tr>
        <td>
        <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
        </td>
        </tr>
        <tr>
        <td>
        <p style="padding:0px 100px;">
        </p>
        </td>
        </tr>
        <tr>
        <td>
        <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
        </td>
        </tr>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <tr>
        <td>
        <a href="${requestNewEmailLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">New Verify Email address</a>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td>
        <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
        <tr>
        <td>
        <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
        </td>
        </tr>
        <tr>
        <td>
        <div style="margin-top:20px;">
    
        <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
        
        <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
        </a>
        
        <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
        </a>
    
        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </body>
        </html>`
    await SendMail({ to: email, subject: "Confirmation Email", html })
    return res.status(201).json({message:'Done'});
    }
    )

export const UserSignIn = asyncHandler(
    async (req,res,next)=>{
    const {email,password,userName}= req.body ;
    const user = await userModel.findOne( {$or : [{userName},{email}]});
    
    if(!user){
        return next(new Error('Error User Doesn`t Exists'), {cause:400});
    }


    const match = bycrypt.compareSync(password, user.password);
    
    if(!match)
    {
        return next(new Error('Error In-valid Data'), {cause:400});
    }
    const UserUpdate = await userModel.findOneAndUpdate( {$or : [{userName},{email}]},{isonline:true,isdeleted : false},{new : true});
    const token = jwt.sign({ id: user._id , userName : user.userName}, process.env.NORMAL_TOKEN_SIG);
    return res.status(200).json({message : 'Done', user, token });
    



}
)