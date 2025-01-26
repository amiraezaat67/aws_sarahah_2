


import { Router } from "express";
import * as messageService from "./Services/message.service.js";
import { authenticationMiddleware, errorHandler } from "../../Middleware/index.js";

const messageController = Router();


messageController.post('/send' , errorHandler(messageService.SendMessageService))
messageController.get('/all' , errorHandler(messageService.GetAllMessagesService))

messageController.get('/user' ,authenticationMiddleware(), errorHandler(messageService.GetUserMessagesService))    
export {messageController}