import {Router} from 'express'
import { UserController } from '../controllers/user.js';

export function createUserRouter({UserModel}){
    const userManagementRouter = new Router();
    const userController = new UserController({UserModel});
    userManagementRouter.post('/register', userController.createUser)
    userManagementRouter.post('/login', userController.loginUser)
    userManagementRouter.post('/logout',userController.logout)
    return userManagementRouter;

}
