const mongoose = require("mongoose");
const harassmentSchema = new mongoose.Schema({
    victimId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    domain:{
        enum:["whatsapp","facebook","instagram","snapchat","others"],
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["complaitRaised","sentToAutority","actionTaken","resolved"],
        default:"complaitRaised",
    },
    phone:{
        type:String,
    },
    profileLink:{
        type:String,
    },
    screenshots:{
        type:[String],//array of strings
        required:true
    }
})

module.exports = mongoose.model("harassments", harassmentSchema)