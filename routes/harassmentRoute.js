const express = require('express');
const router = express.Router();
const {raiseComplaint,fetchAllComplaints,fetchComplaintById,updateStatusOfComplaint} = require("../controllers/HarassmentControler");

router.get("/",fetchAllComplaints)
router.get("/:id",fetchComplaintById)
router.get("/update-status/:id",updateStatusOfComplaint)
router.post("/raise-complaint",raiseComplaint)

module.exports=router;