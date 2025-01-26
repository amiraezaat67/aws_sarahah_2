

import  { Router} from 'express'
import * as AuthServices from './Services/authentication.service.js'
import { validationMiddleware } from '../../Middleware/validation.middelware.js'
import { SingUpSchema } from '../../validators/auth.schema.js'

const authRouter = Router()

authRouter.post('/signup', validationMiddleware(SingUpSchema) , AuthServices.SignUpService)
authRouter.post('/login', AuthServices.LogInService)
authRouter.post('/logout', AuthServices.logOutService)
authRouter.get('/verify-email/:token', AuthServices.verifyEmailService)
authRouter.post('/refresh-token', AuthServices.refreshTokenService)
authRouter.patch('/forget-password', AuthServices.forgetPasswordService)
authRouter.put('/reset-password', AuthServices.resetPasswordService)

export  {authRouter}
