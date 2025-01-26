/**
 * child - parent
 * parent - child
 * embeded document
 */
// ref  , popualte
// ref , refPath

import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    receiverId:{
       type: mongoose.Schema.Types.ObjectId,
       ref:'User'
    }
},
{timestamps:true}
)


export const Message = mongoose.models.Messages ||  mongoose.model('Message' , messageSchema)