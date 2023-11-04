import mongoose from "mongoose"
import { asyncHandler } from "../src/utils/errorHandling.js";



const  DBconnect = asyncHandler( 
    async ()=>{
    return await  mongoose.connect(process.env.DBSTRING).then(console.log('DBConnected'))
    
    })


export default DBconnect;

