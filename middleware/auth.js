const jwt = require("jsonwebtoken");

exports.auth = async(req,res,next) => {
    try{
        console.log(req.cookies);
        const token = req.cookies.token;
        if (!token) {
          return res.status(500).json({
            success: false,
            messeage: "Login to access this routes ",
          });
        }

       const decodeToken = jwt.verify(token,process.env.JWT_SECRET);
        if(!decodeToken){
            return res.status(500).json({
                success:false,
                messeage:"token is invallied"
            })
        }

        console.log(decodeToken)

        req.userId = decodeToken._id

       
        next();
        
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            messeage:"error occured in auth middleware"
        })
    }
}