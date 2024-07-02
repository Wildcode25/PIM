import express from 'express';
import { pool } from './db/db.js';
import { homeRouter } from './routes/home.js';
import { loginRouter } from './routes/login.js';
const app = express();

app.use(express.json())
app.get('/',  (req, res)=>res.json({message: "welcome"}));
app.use('/login', loginRouter);
app.use('/home', homeRouter)
// app.use('/productInfo', ProductInfo )
const PORT=3000
app.listen(PORT, ()=>{
    console.log(pool)
})