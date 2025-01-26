import mongoose from "mongoose";
import { systemRoles } from "../../constants/constants.js";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true,'username is required'],
        // length: [20,'username must be less than 20 characters'],
        lowercase: true,
        trim: true
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: 'idx_email_unique'
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    phone: {
        type: String,
        required: [true , 'Phone is required']
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profileImage:String,
    otp:String, // forget password otp or any otp if applicable
    role:{
        type: String,
        default: systemRoles.USER,
        enum: Object.values(systemRoles)
    }
},{
    timestamps: true
})

const User = mongoose.models.User || mongoose.model('User',userSchema)

export {User}