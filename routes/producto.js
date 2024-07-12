import { Router } from "express";
import { ProductController } from "../controllers/product.js";

export function createdHomeRouter({ProductModel}) {
  const productRouter = new Router();
  const productController = new ProductController({ProductModel});

  productRouter.use((req, res, next)=>{
    const {user} = req.session
    if(!user) return res.json({
      message: "access declined"
  })
    next()
  })
  productRouter.get("/:id", productController.getProductById);

  productRouter.get("/:category/:page", productController.getProductsByCategory);

  productRouter.put("/:id", productController.editProduct);

  productRouter.delete("/:id", productController.deleteProduct);

  return productRouter;
}
