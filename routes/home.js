import { Router } from "express";
import { ProductController } from "../controllers/product.js";

export function createdHomeRouter({ProductModel}) {
  const homeRouter = new Router();
  const productController = new ProductController({ProductModel});

  homeRouter.use((req, res, next)=>{
    const {user} = req.session
    if(!user) return res.json({
      message: "access declined"
  })
    next()
  })
  homeRouter.get("/:id", productController.getProductById);

  homeRouter.get("/:category/:page", productController.getProductsByCategory);

  homeRouter.put("/:id", productController.editProduct);

  homeRouter.delete("/:id", productController.deleteProduct);

  return homeRouter;
}
