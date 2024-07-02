import {userSchema} from '../schemas/user.js'
import {validateInput} from './validateFunction.js';
import { UserModel } from '../models/user.js';
const userModel = new UserModel();
export class UserController{
    getAllUsers = async (req, res)=>{
        // try{

            const users = await userModel.getUsers()
            console.log(users)
            if(users.length>0) return res.json(users)
            res.json({messege: "there are not users"})    

        // }catch(e){
        //     throw new Error(e)
        // }
    }
    createUser = async (req, res)=>{
        const result = validateInput(userSchema,req.body);
        console.log(result)
        if(result.success){
            await userModel.createUser({input: result.data})
            return res.json({message: "user is created succesfuly",
                data: result.data
            })
        }
        return res.status(404).json({error: JSON.parse(result.error.message)})

    }
}
