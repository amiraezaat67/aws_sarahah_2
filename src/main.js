
import express from 'express'
import controllerHandler from './utils/routers-handler.js'
import {database_connection} from './DB/connection.js'
import { config } from 'dotenv'

/**
 * 
 * @description - start the server
 */
const bootstrap = async () => {
    const app = express()
    config()
    
    const port = process.env.PORT || 3000

    app.use(express.json())

    // Handel all project controllers
    controllerHandler(app)

    database_connection()
    
    app.listen(port, () => {
        console.log('Server is running on port 3000')
    })
}


export default bootstrap


