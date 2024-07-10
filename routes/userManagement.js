import {Router} from 'express'
import { UserController } from '../controllers/user.js';

const userManagementRouter = new Router();


export function createUserRouter({UserModel}){
    const userController = new UserController({UserModel});
    // TODO: get all users method was not requested
    userManagementRouter.get('/',userController.getAllUsers);
    userManagementRouter.post('/register', userController.createUser)
    userManagementRouter.post('/login', userController.loginUser)
    userManagementRouter.post('/logout',userController.logout)
    return userManagementRouter;

}
