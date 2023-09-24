const express = require('express');
const router = express.Router();
const {fetchUsers}=require('../controllers/Users')

router.get("/",fetchUsers)

module.exports=router;