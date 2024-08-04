const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
name:{
    type:String,
    required:true
},
username:{
    type:String,
    required:true,
    unique:true
},
bio:{
    type:String,
},
password:{
    type:String,
    required:true,
    select:false,
},
avatar:{
    public_id:{
        type:String,
        required:true,
    },
    url:{
        type:String,
        required:true
    }
}
},
{timestamps:true}
)

module.exports = mongoose.model("User",userSchema)