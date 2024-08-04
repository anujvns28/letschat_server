const User = require("../models/user");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { options } = require("../routes/auth");


// signup
exports.signUp = async(req,res) => {
    try{
    //fetchin data
    const {
        name,
        userName,
        password,
        bio
      } = req.body

    console.log(req.files.avatar,"filses")

    const avatar = req.files.avatar;
    
      if (
        !name ||
        ! userName ||
        !password ||
        ! bio ||
        ! avatar
      ) {
        return res.status(403).send({
          success: false,
          message: "All Fields are required",
        })
      }

      // Check if user already exists
      const existingUser = await User.findOne({username:userName});
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "userName already exists. Please sign in to continue.",
        })
      }

      const avatarUrl = await uploadImageToCloudinary(avatar);

      console.log(avatarUrl);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        name,
        username:userName,
        password: hashedPassword,
        bio:bio,
        avatar : {
            public_id : avatarUrl.public_id,
            url : avatarUrl.url
        }
  })

    const token = jwt.sign(
        {userName:userName,_id:user._id},
        process.env.JWT_SECRET,
        {
            expiresIn:"24h"
        }
    );

    user.token = token;
    const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }

    return res.cookie("token",token,options).status(200).json({
        success: true,
        user,
        message: "User registered successfully",
    })

    }catch(error){
        console.log(error)
        return res.status(500).json({
           success:false,
           message:"Error occerured in Signup form",
        })   
    }
}



exports.login = async (req, res) => {
    try {
      const { userName, password } = req.body
  
      // Check if email or password is missing
      if (!userName || !password) {
        return res.status(400).json({
          success: false,
          message: `Please Fill up All the Required Fields`,
        })
      }
  
      // Find user with provided email
      const user = await User.findOne({username:userName}).select("+password");

  
      // If user not found with provided email
      if (!user) {
        return res.status(401).json({
          success: false,
          message: `User is not Registered with Us Please SignUp to Continue`,
        })
      }

      console.log(user)
  
      //  Compare Password
      if(await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          {username:user.username,_id:user._id,},
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        )

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
          }

        res.cookie("token",token,options).status(200).json({
          success: true,
          user,
          token,
          message: `User Login Success`,
        })
      } else {
        return res.status(401).json({
          success: false,
          message: `Password is incorrect`,
        })
      }

    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: `Login Failure Please Try Again`,
      })
    }
  }




  exports.logout = (req,res) => {
    const options = {
        expires:0,
    }

    return res.cookie("token","",options).status(200).json({
        success:false,
        message:"logout successfully"
    })
  }





