const { ALERT, REFETCH_CHAT } = require("../constants/events");
const chat = require("../models/chat");
const User = require("../models/user");
const { emitEvent } = require("../utils/fetueres");



exports.createGroup = async(req,res) => {
    try{
        //fetching required data
        const {name,members} = req.body;

        if(!name || !members) 
            return res.status(500).json({
            success:false,
            messeage:"all fildas are required"
        })

        if(members.length < 2){
            return res.status(500).json({
                success:false,
                messeage:"at least two member are required"
            })    
        }

        const allMembers = [...members,req.userId];

        const group = await chat.create({
            groupChat:true,
            name:name,
            members:allMembers,
            createor:req.userId
        })

        emitEvent(req,ALERT,allMembers,`Welecome to ${name} group chat`);
        emitEvent(req,REFETCH_CHAT,members);

        return res.status(200).json({
            success:true,
            message:"group created successfulll"
        })



    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"error occured in creating group"
        })
    }
}

exports.getMyChats = async(req,res) => {
    try{
       
        const chats = await chat.find({members:req.userId}).populate(
            "members",
            "name  avatar"
        )

        const filterChats = chats.filter((chat) => chat._id !== req.userId);
        
        const transformedChats = filterChats.map((chat) => ({
            _id:chat._id,
            name:chat.name,
            members:chat.members.reduce((prev,curr) => {
                if(curr._id.toString() !== req.userId.toString()){
                    prev.push(curr._id)
                }
                return prev;
            },[]),
            avatar:chat.groupChat ? chat.members.slice(0,3).map((item) => item.avatar.url ) : avatar.url
        }))

        return res.status(200).json({
            success:true,
            message:"group created",
            data:transformedChats
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Error occured in fetching chats"
        })
    }
}

exports.groupChats = async(req,res) =>{
    try{

        const chats = await chat.find({
            members:req.userId,
            groupChat:true,
            createor:req.userId
        }).populate("members","name avatar")

        const groups = chats.map((chat) => ({
            _id:chat._id,
            groupChats:true,
            creator : req.userId,
            avatar : chat.members.slice(0,3).map((i) => i.avatar.url)
        }))


        return res.status(200).json({
            success:true,
            message:"group fetched successfully",
            data:groups
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            sucess:false,
            message:"error occured in fetching my groups"
        })
    }
}


exports.addMembers = async(req,res) =>{
    try{
        
        const {chatId,members} = req.body;

        if(!chatId || !members){
            return res.status(500).json({
                sucess:false,
                message:"all filds are requred"
            })
        }

        if(members.length<1){
            return res.status(500).json({
                sucess:false,
                message:"please provid members"
            })
        }

        

        const group  = await chat.findById(chatId);

        if(!group){
            return res.status(500).json({
                sucess:false,
                message:"Chatis in not vallied"
            })
        }

        if(!group.groupChat){
            return res.status(500).json({
                sucess:false,
                message:"This is not group"
            })
        }

        if(group.createor.toString() !== req.userId.toString()){
            return res.status(500).json({
                sucess:false,
                message:"you are not allowd to add members in this group"
            })
        }

        const allNewMemberPromise = members.map((i) => User.findById(i));

        const allNewMembers = await Promise.all(allNewMemberPromise);

        group.members.push(...allNewMembers.map((i)=> i._id));

        await group.save();

        const allUserName = allNewMembers.map((mem) => mem.name).join(",");

        emitEvent(
            req,
            ALERT,
            group.members,
            `${allUserName} has been added in this group`
        )

        emitEvent(
            req,
            REFETCH_CHAT,
            group.members
        )

        return res.status(200).json({
            success:true,
            message:"Members added successfully"
        })
       

        return res.status(200).json({
            success:true,
            message:"member added  successfully",
            data:groups
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            sucess:false,
            message:"error occured in adding member"
        })
    }
}


exports.removeMember = async(req,res) =>{
    try{
        
        const {chatId,memberId} = req.body;

        if(!chatId || !memberId){
            return res.status(500).json({
                sucess:false,
                message:"all filds are requred"
            })
        }

       
        const [group,userThatWillBeRemoved]  = await Promise.all([
            chat.findById(chatId),
            User.findById(memberId,"name")
        ]);

        if(!group){
            return res.status(500).json({
                sucess:false,
                message:"Chatis in not vallied"
            })
        }

        if(!group.groupChat){
            return res.status(500).json({
                sucess:false,
                message:"This is not group"
            })
        }

        if(group.createor.toString() !== req.userId.toString()){
            return res.status(500).json({
                sucess:false,
                message:"you are not allowd to remove members in this group"
            })
        }

        if(group.members.length <=3){
            return res.status(500).json({
                sucess:false,
                message:"group must have at least 3 members"
            })
        }

        group.members = group.members.filter((i) => i._id.toString() !== memberId.toString());

        await group.save();

        emitEvent(
            req,
            ALERT,
            group.members,
            `${userThatWillBeRemoved.name} has been removed from this group`
        )

        emitEvent(
            req,
            REFETCH_CHAT,
            group.members
        )

        return res.status(200).json({
            success:true,
            message:"Member removed  successfully"
        })
       

    }catch(err){
        console.log(err)
        return res.status(500).json({
            sucess:false,
            message:"error occured in adding member"
        })
    }
}
