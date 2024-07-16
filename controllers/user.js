import {loginSchema} from '../schemas/loginUser.js'
import {validateInput} from './validateFunction.js';
import { registerSchema } from '../schemas/userRegister.js';
import jwt  from 'jsonwebtoken';
import bcrypt from "bcrypt";


export class UserController{
    constructor({UserModel}){
        this.userModel = new UserModel();
    }
    getAllUsers = async (req, res)=>{
        const {user} = req.session
        console.log(user)
        if(!user) return res.json({
            message: "access declined"
        })
        try{
            
            const users = await this.userModel.getUsers()
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
            const user = await this.userModel.loginUser({email: result.data.email})
            if(!user) return res.json({messege: "there is not user registed"});
            const isValid = await bcrypt.compare(result.data.password, user.password);
            if (!isValid) return res.json({ message: "Incorrect password" });
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
                user
            })   

           }
           res.status(401).json({error: JSON.parse(result.error.message)})

        }catch(e){
            console.error(`Error in login ${e.message}`)
        }
    }
    createUser = async (req, res)=>{
        const result = validateInput(registerSchema,req.body);
        const SALT = process.env.SALT||12
        if(result.success){
            result.data.password = await bcrypt.hash(result.data.password, SALT)
            const createdUser = await this.userModel.createUser({input: result.data});
            if(!createdUser) return res.json("User already exist")
            return res.json({ createdUser})
        }
        return res.status(404).json(JSON.parse(result.error.message))
    }
    logout = async (req, res)=>{
        res.clearCookie('access_token').json({
            message: "user has left"
        })
    }
}
