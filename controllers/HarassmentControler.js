const HarassmentModel=require("../models/HarassmentModel")
async function raiseComplaint(req,res){
    const {victimId,domain,description,phone,profileLink,screenshots}=req.body;
    console.log({victimId,domain,description,phone,profileLink,screenshots})
    try{
        const complaint=new HarassmentModel({victimId,domain,description,phone,profileLink,screenshots})
        const complaintInstanc=await complaint.save()
        res.status(200).send(complaintInstanc)
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
async function fetchAllComplaints(req,res){
    try{
        const complaints=await HarassmentModel.find()
        res.send(complaints)
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
async function fetchComplaintById(req,res){
    const {id}=req.params
    try{
        const complaint=await HarassmentModel.findById(id)
        res.send(complaint)
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

async function updateStatusOfComplaint(req,res){
    const {id}=req.params
    try{
        await HarassmentModel.findByIdAndUpdate({_id:id},{status:req.body.status})
        const complaint=await HarassmentModel.findById(id)
        res.send(complaint)
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
module.exports={raiseComplaint,fetchAllComplaints,fetchComplaintById,updateStatusOfComplaint}