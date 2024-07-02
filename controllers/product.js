import { validateInput } from "./validateFunction.js";
import {productSchema} from '../schemas/product.js';
import { ProductModel } from "../models/product.js";
const productModel = new ProductModel()

export class ProductController{
    getAllProducts = async (req, res)=>{
        const page=parseInt(req.params.page) || 1
        try{
            const products = await productModel.getAllProducts({page})
            if(products.length) return res.json(products);
            return res.status(404).json({message: "product not found",
            })
        }catch(e){
            throw new Error("Error getting all products: "+e)
        }
    } 
    createProduct = async (req, res)=>{
        try{
            const result = validateInput(productSchema, req.body);
            if(result.success) {
                await productModel.createProduct({product: result.data});
                console.log(result.data)
                return res.status(200).json({message: "product created successfuly",
                    data: result.data
                })
            }
            return res.status(404).json({error: JSON.parse(result.error.message)})
        }catch(e){
            throw new Error(`Error creating product: ${e}`)
        }
    }

}