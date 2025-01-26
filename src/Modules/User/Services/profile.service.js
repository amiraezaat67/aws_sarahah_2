

import { compareSync, hashSync } from "bcrypt";
import {v4 as uuid4}  from 'uuid'

import { BlacklistToken, User} from "../../../DB/models/index.js";
import { Decryption, Encryption } from "../../../utils/crypto.utils.js";
import { generateToken } from "../../../utils/tokens.utils.js";
import { EmailEvent } from "../../../Services/send-email.service.js";


export const profileService = async (req, res,next) => {
    const {_id} = req.loggedInUser  

    const data = await User.findById(_id)

    data.phone = Decryption({value:data.phone, secret:process.env.ENCRYPTION_SECRET_KEY})
        
    res.status(200).json({message:'Success', data})
}



export const updatePasswordService = async(req, res) => {
    const {_id} = req.loggedInUser
    const {oldPassword, newPassword, confirmNewPassword} = req.body


    if(newPassword !== confirmNewPassword){
        return res.status(400).json({ message: 'Passwords do not match' })
    }

    const user  = await User.findById(_id)
    if(!user){
        return res.status(404).json({ message: 'User not found' })
    }

    const isPasswordMatched = compareSync(oldPassword, user.password)
    if(!isPasswordMatched){
        return res.status(400).json({ message: 'Invalid password' })
    }

    // hash new password
    const hashedPassword = hashSync(newPassword, +process.env.SALT)
    user.password = hashedPassword
    await user.save()

    // revoke user token
    await BlacklistToken.create(req.loggedInUser.token)

    res.status(200).json({ message: 'Password updated successfully' })
}

export const updateProfileService = async(req, res) => {
    const{_id} = req.loggedInUser
    const { email , username , phone} = req.body

    // check if user is valid
    const user = await User.findById(_id)
    if(!user){
        return res.status(404).json({ message: 'User not found' })
    }

    if(username)  user.username = username
    if(phone) user.phone = Encryption({value:phone, secret:process.env.ENCRYPTION_SECRET_KEY})

    if(email){
        // check if email is already exist
        const isEmailExist = await User.findOne({email})
        if(isEmailExist){
           return res.status(409).json({ message: 'Email already exist' })
        }
  
        // send email
        const token = generateToken({
           publicClaims:{ _id:user._id},
           registeredClaims: { 
              expiresIn:process.env.CONfIRM_EMAIL_EXPIRATION_TIME,
              jwtid:uuid4()
           },
           secretKey:process.env.JWT_SECRET_KEY_CONFIRM
        })
        const confirmationLink = `${req.protocol}://${req.headers.host}/auth/verify-email/${token}`
  
        EmailEvent.emit('sendEmail', {
           subject:'Welcome to Social App',
           html:`
           <h1>Welcome to Social App</h1>
           <p>Thank you for registering with us please verify your email by clicking on the link below</p>
           <a href="${confirmationLink}">please confirm</a>
           `,
           email
        })

        // update user email and isVerified
        user.email = email
        user.isVerified = false
    }

    // store changed data
    await user.save()
    res.status(200).json({ message: 'Profile updated successfully' })
}


export const listUsersService = async(req, res) => {
    const users = await User.find({}, '-password -__v') 
    res.status(200).json({ message: 'Success', data:users })  
}


