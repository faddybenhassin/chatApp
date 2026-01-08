import { jwt } from "jsonwebtoken";
import User from "../models/user.model";

export default async function protectRoute(req,res,next){
    try {
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({message:"Unauthorized - no token provided"})
        }

        const decoded = jwt.verify(token, process.env.JWTSecret)
        if(!decoded){
            return res.status(401).json({message:"Unauthorized - invalid token"})
        }

        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(404).json({message:"user not found"})
        }

        req.user = user
        next()

    } catch (err) {
        console.error("Auth error:", err.message)
        return res.status(500).json({message:"Internal server error"})
    }
}