export const asyncHandler = (fn) => {
    return (req,res,next)=>{
        fn(req,res,next).catch((err) =>{
            return next(new Error (err , {cause : 500}))
        })
    }

}




export const globalerrorHandling = (error , req,res,next)=>{
    return res.status(error.cause || 500 ).json (error.message)
}