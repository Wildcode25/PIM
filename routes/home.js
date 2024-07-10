import { Router } from "express";
import { ProductController } from "../controllers/product.js";

export function createdHomeRouter({ProductModel}) {
  const homeRouter = new Router();
  const productController = new ProductController({ProductModel});

  homeRouter.use((req, res, next)=>{
    const {user} = req.session
    // TODO: use the correct status code for unauthorized
    if(!user) return res.json({
      message: "access declined"
  })
    next()
  })
  //TODO: missing a get all products route
  homeRouter.get("/:id", productController.getProductById);

  // TODO: this method was not requested
  homeRouter.get("/:category/:page", productController.getProductsByCategory);

  homeRouter.put("/:id", productController.editProduct);

  homeRouter.delete("/:id", productController.deleteProduct);

  return homeRouter;
}
