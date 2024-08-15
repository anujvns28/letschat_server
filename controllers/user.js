const Chat = require("../models/chat");
const User = require("../models/user");
const Request = require("../models/request");
const { emitEvent } = require("../utils/fetueres");
const { NEW_REQUEST } = require("../constants/events");



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

exports.searchUsers = async(req,res) => {
    try{
        const {name=""} = req.query;

        const mychats = await Chat.find({groupChat:false,members:req.userId});
        
        const allUserFromMyChats = mychats.flatMap((chat) =>chat.members);

        const allUserExpectMeAndFrainds = await User.find({
            _id:{$nin:allUserFromMyChats},
            name:{$regex:name,$options:"i"}
        })

        const users = allUserExpectMeAndFrainds.map(({_id,name,avatar}) => ({
            _id,
            name,
            avatar:avatar.url
        }))
        
        return res.status(200).json({
            success:true,
            messeage:"user serched successfully",
            users
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"error occured in searching user"
        })
    }
  } 

exports.sendFraindRequest = async(req,res) =>{
    try{
        const {userId} = req.body;
        
        if(!userId){
            return res.status(404).json({
                success:false,
                message:"UserId is required"
            })
        }

        const request = await Request.findOne({
            $or:[
                {sender:userId,reciver:req.userId},
                {sender:req.userId,reciver:userId}
            ]
        });

        if(request){
            return res.status(404).json({
                success:false,
                message:"request alredy sent"
            })
        }

        await Request.create({
            sender:req.userId,
            reciver:userId
        })

        emitEvent(req,NEW_REQUEST,[userId])

        return res.status(200).json({
            success:true,
            message:"request send"
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"error occured in sending fraind request"
        })
    }
} 

