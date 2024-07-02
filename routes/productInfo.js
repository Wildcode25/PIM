import {Router} from 'express';
import {ProductInfoController} from '../controllers/productInfo.js'
const productInfoController = new ProductInfoController()
export const productInfoRouter = new Router();

productInfoRouter.get('/:id', productInfoController.getProduct);

productInfoRouter.post('/', productInfoController.createProduct);

productInfoRouter

