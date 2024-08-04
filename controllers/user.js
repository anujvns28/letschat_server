const User = require("../models/user");



exports.profile = async(req,res) => {
    try{

        const user = await User.findById(req.userId);
        
        return res.status(200).json({
            success:true,
            messeage:"Profile fetched successfully",
            user:user
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"error occured in profile fatching"
        })
    }
  }