import jwt from "jsonwebtoken";

const protect=(req,res,next)=>{
    const token=req.cookies.token
    if(!token){
        return res.status(401).json({success:false,message:"Unauthorized Access"})
    }
    try{
        const decodedToken=jwt.verify(token,"GIRI_PRASAD_ALLU");
        req.user=decodedToken;
        next();
    }catch(error){
        console.log(error);
        res.status(401).json({success:false,message:"Unauthorized Access"})
    }
}

export default protect


