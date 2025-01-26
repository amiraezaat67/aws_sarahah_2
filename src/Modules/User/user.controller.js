

import  { Router} from 'express'
import * as UserServices from './Services/profile.service.js'  
import { authenticationMiddleware, authorizationMiddleware , errorHandler } from '../../Middleware/index.js'
import { ADMIN_USER, systemRoles } from '../../constants/constants.js'
// import  asyncHandler  from 'express-async-handler'

const userController = Router()
const { USER} = systemRoles

userController.use(authenticationMiddleware() )

userController.get('/profile' ,authorizationMiddleware([USER]) , errorHandler(UserServices.profileService)) 
userController.patch('/update-password' , errorHandler(UserServices.updatePasswordService))
userController.put('/update-profile' , errorHandler(UserServices.updateProfileService))
userController.get('/list' ,authorizationMiddleware(ADMIN_USER) ,errorHandler(UserServices.listUsersService))



export  {userController}

