
import dotenv from 'dotenv'
dotenv.config()
import { httpServer } from './config/httpServer.js';

const PORT = process.env.PORT || 3000

httpServer.listen(PORT, ()=>{
    console.log("Servidor levantado correctamente ")
})