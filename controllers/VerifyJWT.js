const jwt=require("jsonwebtoken")
const  UserModel=require("../models/UserModel")

const VerifyJWT=async (req,res,next)=>{
    const authHeader=req.headers['authorization']
    if(!authHeader){
        return res.status(404).json({status:"failed",reason:"header not found"})
    }
    const token=authHeader.split(' ')[1];
    jwt.verify(token,process.env.JSON_WEB_TOKEN_CRYPTO_SECRET_KEY,async (err,decoded)=>{
        if(err){
            return res.status(500).json({status:"failed",reason:"internal server error",err})
        }
        req._id=decoded._id;
       
        try{
            var client=await UserModel.findById(req._id)
        }catch(err){
            return res.status(403).json({status:"failed",reason:"User not found for the given id",err})                 
        }

        if(!(client.email===req.body.email)){
            console.log(client.email,req.email)
            return res.status(403).json({status:"failed",reason:"userid and accessToken not matching"})          
        }

        next()
    })
}
module.exports={VerifyJWT}