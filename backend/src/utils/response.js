module.exports = {
    success: (res, data, message='Success')=>{
        return res.json({success:true, message, data});
    },
    error: (res, message='Error', code=400)=>{
        return res.status(code).json({success:false, message});
    }
}
