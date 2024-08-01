const mongoose = require("mongoose");

const requesSchema = new mongoose.Schema({
    status:{
        type:String,
        default:"pending",
        enum:["pending","accepted","rejected"],
    },
    sender:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    reciver:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
},
{timestamps:true}
)

module.exports = mongoose.model("Request",requesSchema)