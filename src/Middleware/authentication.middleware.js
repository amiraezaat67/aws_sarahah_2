import { BlacklistToken, User } from "../DB/models/index.js"
import { verifyToken } from "../utils/tokens.utils.js"


export const authenticationMiddleware = ()=>{
    return async (req,res,next)=>{
        try {

            const {accesstoken} = req.headers
            if(!accesstoken){
                return res.status(400).json({ message: 'Please login' })
            }

            // verify token
            const decodedToken = verifyToken({token:accesstoken, secretKey:process.env.JWT_SECRET_KEY})

            // check if token is blacklisted
            const isTokenBlacklisted = await BlacklistToken.findOne({tokenId:decodedToken.jti})
            if(isTokenBlacklisted){
                return res.status(401).json({ message: 'This token is expired. Please login again to generate a correct token' })
            }

            // get data from database
            const user  = await User.findById(decodedToken._id ,'-password -__v')
            if(!user){
                return res.status(401).json({ message: 'Please Signup' })
            }

            // add user to request
            req.loggedInUser  = {...user._doc,token:{ tokenId: decodedToken.jti, expiresAt: decodedToken.exp}}

            next()

        } catch (error) {
            console.log(error);
            if(error.name === 'TokenExpiredError'){
                return res.status(401).json({ message: 'This token is expired. Please login again to generate a correct token'})
            }
            return res.status(500).json({ message: 'Something went wrong' })
        }
    }
}


export const authorizationMiddleware = (allowedRoles)=>{
    return (req,res,next)=>{
        try {
            const {role:loggedInUserRole} = req.loggedInUser
            
            const isRoleAllowed = allowedRoles.includes(loggedInUserRole)
            if(!isRoleAllowed){
                return res.status(401).json({ message: 'Unauthorized' })
            }
            
            next()
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Something went wrong' })
        }
    }
}
