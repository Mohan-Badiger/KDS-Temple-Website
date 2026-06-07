import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next)=>{

    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.headers.token;

        if(!token){
            return res.status(401).json({success:false, message:"Not Authorized Login again"})
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        if(token_decode.role !== 'admin'){
            return res.status(401).json({success:false, message:"Not Authorized Login again"})
        }
        req.admin = token_decode;
        next()
    } catch (error) {
        console.error("Admin Auth Error:", error);
        res.status(401).json({success:false, message:"Not Authorized Login again"})
    }

}

export default adminAuth;