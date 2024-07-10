import { validateInput } from "./validateFunction.js";
import { productSchema } from "../schemas/product.js";

export class ProductController {
  constructor({ProductModel}){
     this.productModel = new ProductModel()
  }
  getProductById = async (req, res) => {
    const { id } = req.params;
    // TODO: validate id before calling the model
    try {
      const product = await this.productModel.getProductById({ id });
      if (product != null) return res.json(product);
      // TODO: use the correct status code for not found
      res.json({ message: "product not found" });
    } catch (e) {
      // TODO: use the correct status code for internal server error
      // TODO: should not throw the error, should return a response with the error
      throw new Error(e);
    }
  }
   getProductsByCategory = async (req, res) => {
    const { category, page } = req.params;
    try {
      const products = await this.productModel.getProductsByCategory({category, page});
      if (products != null) return res.json(products);

      res.json({ message: "product not found" });
    } catch (e) {
      // TODO: use the correct status code for internal server error
      // TODO: should not throw the error, should return a response with the error
      throw new Error(e);
    }
  }
  createProduct = async (req, res) => {
    try {
      const result = validateInput(productSchema, req.body);
      if (result.success) {
        await this.productModel.createProduct({ product: result.data });
        // TODO: use the correct status code for created
        // TODO: should return the created product not the input
        return res
          .status(200)
          .json({ message: "product created successfuly", data: result.data });
      }
      // TODO: use the correct status code for bad request
      return res.status(404).json({ error: JSON.parse(result.error.message) });
    } catch (e) {
      // TODO: use the correct status code for internal server error
      // TODO: should not throw the error, should return a response with the error
      throw new Error(`Error creating product: ${e}`);
    }
  };
  editProduct = async (req, res) => {
    const { id } = req.params;
    try {
      // TODO: validate id before calling the model
      // TODO: validate input before calling the model
      const isProductEdited = await this.productModel.editProduct({
        id,
        input: req.body,
      });

      if (isProductEdited) {
        const productEdited = await this.productModel.getProductById({
          id
        });
        return res.json({
          message: "product edited successfuly",
          data: productEdited,
        });
      }
      // TODO: use the correct status code for not found
      return res.json({ message: "Product not found" });
    } catch (e) {
      // TODO: use the correct status code for internal server error
      // TODO: should not throw the error, should return a response with the error
      throw new Error(`Error editing product: ${e.message}`);
    }
  };
  deleteProduct = async (req, res)=>{
    const {id} = req.params
    try{
        // TODO: validate id before calling the model
        const isProductDelected = await this.productModel.deleteProduct({id});
        if(isProductDelected) return res.json({message: "Product delected successfuly"});
        res.status(404).json({message: "Product not found"})
    }catch(e){
      // TODO: use the correct status code for internal server error
      // TODO: should not throw the error, should return a response with the error
        throw new Error("Error deleting product")

    }
  }
}
