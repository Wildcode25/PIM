import {loginSchema} from '../schemas/loginUser.js'
import {validateInput} from './validateFunction.js';
import { UserModel } from '../models/user.js';
import { registerSchema } from '../schemas/userRegister.js';
import jwt  from 'jsonwebtoken';
const userModel = new UserModel();
export class UserController{
    getAllUsers = async (req, res)=>{
        const {user} = req.session
        console.log(user)
        if(!user) return res.json({
            message: "access declined"
        })
        try{
            
            const users = await userModel.getUsers()
            console.log(users)
            if(users.length>0) return res.json(users)
            res.json({messege: "there are not users"})    

        }catch(e){
            throw new Error(e)
        }
    }
    loginUser = async (req, res)=>{
        
        try{
           const result = validateInput(loginSchema, req.body)
           if(result.success){
            const user = await userModel.loginUser({input: result.data})
            if(user==null) return res.json({messege: "there is not user registed"});
            const token = jwt.sign(
                user,
                process.env.JWT_PRIVATE_KEY,
                {
                    expiresIn: '1h'
                }
            )
            return res.cookie(
                'access_token',
                token,
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV==='producction',
                    sameSite: 'strict'
                }
            ).send({
                message: 'user logged',
                token
            })   

           }
           res.status(401).json({error: JSON.parse(result.error.message)})

        }catch(e){
            throw new Error(e)
        }
    }
    createUser = async (req, res)=>{
        const result = validateInput(registerSchema,req.body);
        console.log(result)
        if(result.success){
            const data = await userModel.createUser({input: result.data})
            return res.json({ data})
        }
        return res.status(404).json({error: JSON.parse(result.error.message)})

    }
    logout = async (req, res)=>{
        res.clearCookie('access_token').json({
            message: "user has left"
        })
    }
}
