const User = require("../models/UserModel")

async function fetchUsers(req,res){
    try{
        const users=await User.find({},{password:0})
        res.send(users)
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

module.exports={fetchUsers}