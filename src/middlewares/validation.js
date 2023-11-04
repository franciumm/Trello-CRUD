export const validation = (schema)=>{
return (req,res,next)=>{
    const validateData = schema.validate(req.body , {abortEarly : false});
    if(validateData.error){return res.json(validateData.error)}else {return next()}
}

}