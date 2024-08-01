const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
name:{
    type:String,
    required:true
},
groupChat:{
    type:Boolean,
    default:false,
},
createor:{
    type : mongoose.Schema.Types.ObjectId,
    ref:"User"
},
members:[{
     type : mongoose.Schema.Types.ObjectId,
    ref:"User"
}]

},
{timestamps:true}
)

module.exports = mongoose.model("Chat",chatSchema)