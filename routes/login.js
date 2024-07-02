import {Router} from 'express'
import { UserController } from '../controllers/user.js';

// const productController = new ProductController();
const loginRouter = new Router();
const userController = new UserController();
loginRouter.get('/',userController.getAllUsers);
loginRouter.post('/', userController.createUser)
// homeRouter.get('/:categories', productController.getByCategories)
export {loginRouter}