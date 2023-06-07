const jwt = require("jsonwebtoken")
const dotenv = require("dotenv").config()


const validateToken = async(req,res,next)=>{
    let token;
    const authHeaders = req.headers.Authorization||req.headers.authorization

    if (authHeaders && authHeaders.startsWith("Bearer")) {
        token = authHeaders.split(" ")[1]
        jwt.verify(token,process.env.TOKEN_SECRET, (err,decoded)=>{
            if (err) {
               res.status(401).json({
                message: "User is not authorized"
               })
            }
            req.user = decoded.user
            next()
        })
        if (!token) {
            res.status(401).json({
                message: "User is not authorized"
               })
        }
    }
}
module.exports= validateToken