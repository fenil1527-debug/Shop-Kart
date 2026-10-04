import jwt from 'jsonwebtoken';
export const authMiddleware = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            success:false,
            message: "Authentication required"
        });

    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log("Decoded JWT:",decoded);
        req.user =decoded;
        next();
    }catch (error){
        return res.status(401).json({
            success:false,
            message:"invalid or expired token"
        });
    }
};