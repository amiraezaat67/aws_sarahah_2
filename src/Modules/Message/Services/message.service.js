import { Message, User } from "../../../DB/models/index.js"


export const SendMessageService = async (req,res)=>{
    const { content , receiverId} = req.body  // 6793c23fc2d2903bcf46b08a


    const isuserExist = await User.findById(receiverId)
    if(!isuserExist){
        return res.status(404).json({ message: 'User not found' })
    }
    const message = await Message.create({
        content,
        receiverId
    })

    res.status(200).json({ message: 'Message sent successfully' , message})
}



export const GetAllMessagesService = async (req,res)=>{
    const messages= await Message.find()
    .populate(
        [
            {
                path:'receiverId',
            }
        ]
    )

    res.status(200).json({ message: 'Success', data:messages })
}



export const GetUserMessagesService = async (req,res)=>{
    const {_id} = req.loggedInUser  // 6793c23fc2d2903bcf46b08a

    const messages= await Message.find({receiverId:_id})    
    res.status(200).json({ message: 'Success', data:messages }) 
}