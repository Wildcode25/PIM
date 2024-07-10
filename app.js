//TODO: a best way to organize the project is to put all the project code into src/ folder
import { httpServer } from './config/httpSErver.js';
import './config/dotenv.js'


const PORT= process.env.PORT || 3000

httpServer.listen(PORT, ()=>{
    console.log("Servidor levantado correctamente ")
})