const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    contant : String,
    attachments:[
        {
            public_id:{
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    sender:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    chat:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },


},
{timestamps:true}
)

module.exports = mongoose.model("Message",messageSchema)