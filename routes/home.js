import {Router} from 'express'
import { ProductController } from '../controllers/product.js';

const homeRouter = new Router();
const productController=new ProductController()

homeRouter.get('/:page', productController.getAllProducts)
homeRouter.post('/', productController.createProduct)

export {homeRouter}