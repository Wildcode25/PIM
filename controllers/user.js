import {loginSchema} from '../schemas/loginUser.js'
import {validateInput} from './validateFunction.js';
import { UserModel } from '../models/user.js';
import { registerSchema } from '../schemas/userRegister.js';
import jwt  from 'jsonwebtoken';
// TODO: the user model should be injected in the constructor
const userModel = new UserModel();
export class UserController{
    // TODO: this method was not requested
    getAllUsers = async (req, res)=>{
        const {user} = req.session
        // TODO: remove console.log
        console.log(user)
        // TODO: use the correct status code for unauthorized

        if(!user) return res.json({
            message: "access declined"
        })
        try{
            
            const users = await userModel.getUsers()/
            // TODO: remove console.log
            console.log(users)
            // TODO: it should return an empty array if there are no users
            if(users.length>0) return res.json(users)
            res.json({messege: "there are not users"})    

        }catch(e){
            // TODO: use the correct status code for internal server error
            // TODO: should not throw the error, should return a response with the error
            throw new Error(e)
        }
    }
    loginUser = async (req, res)=>{
        
        try{
           const result = validateInput(loginSchema, req.body)
           if(result.success){
            const user = await userModel.loginUser({input: result.data})
            // TODO: use the correct status code for unauthorized
            if(user==null) return res.json({messege: "there is not user registed"});
            // TODO: do not use user password in the token
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
            // TODO: use the correct status code for internal server error
            // TODO: should not throw the error, should return a response with the error
            throw new Error(e)
        }
    }
    createUser = async (req, res)=>{
        // TODO: handle error with try catch
        const result = validateInput(registerSchema,req.body);
        // TODO: remove console.log
        console.log(result)
        if(result.success){
            const data = await userModel.createUser({input: result.data})
            return res.json({ data})
        }
        // TODO: use the correct status code for bad request
        return res.status(404).json({error: JSON.parse(result.error.message)})

    }
    logout = async (req, res)=>{

        res.clearCookie('access_token').json({
            message: "user has left"
        })
    }
}
