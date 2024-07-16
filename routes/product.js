import { Router } from "express";
import { ProductController } from "../controllers/product.js";

export function createProductRouter({ProductModel}) {
  const productRouter = new Router();
  const productController = new ProductController({ProductModel});

 productRouter.post('/', productController.createProduct)

  productRouter.get("/:category/:page", productController.getProductsByCategory);

  productRouter.put("/:id", productController.editProduct);

  productRouter.delete("/:id", productController.deleteProduct);

  return productRouter;
}
