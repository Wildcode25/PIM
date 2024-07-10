
import { httpServer } from './config/httpSErver.js';
import './config/dotenv.js'


const PORT= process.env.PORT || 3000

httpServer.listen(PORT, ()=>{
    console.log("Servidor levantado correctamente ")
})