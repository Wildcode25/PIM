import { validateInput } from "./validateFunction.js";
import { productSchema } from "../schemas/product.js";
import { getOffset } from "../utils/getOffset.js";

export class ProductController {
  constructor({ ProductModel }) {
    this.productModel = new ProductModel();
  }
  getProductsByCategory = async (req, res) => {
    const { category, page } = req.params;
    const offset = getOffset(page);
    let products;
    try {
      if (category == "all")
        products = await this.productModel.getAllProducts({ offset });
      else
        products = await this.productModel.getProductsByCategory({
          category,
          offset,
        });
      if (!products) return res.json({ message: "products not found" });
      products = products.map(async (product) => {
        product.categories = await this.productModel.getCategories({
          id: product.id,
        });
        return product;
      });
      Promise.all(products).then((data) => res.json(data));
    } catch (e) {
      console.error(`Error getting products by category: ${e.message}`);
    }
  };
  createProduct = async (req, res) => {
    try {
      const result = validateInput(productSchema, req.body);
      if (result.success) {
        const categories = result.data.categories;
        const { categories: _, ...product } = {...result.data, customer_id: req.session.user.id};
        let createdProduct = await this.productModel.createProduct({ product });
        categories.forEach(
          async (category) =>
            await this.productModel.createProduct_category({
              product_id: createdProduct.id,
              category,
            })
        );
        createdProduct.categories = categories
       return res
            .status(200)
            .json({ message: "product created successfuly", createdProduct });
        
      }

     res.status(404).json({ error: JSON.parse(result.error.message) });
    } catch (e) {
      throw new Error(`Error creating product: ${e}`);
    }
  };
  editProduct = async (req, res) => {
    const { id } = req.params;
    let { categories } = req.body;
    try {
      if (categories)
        await this.editProduct_category({ id, categories }).catch(() =>
          res.json({ message: "Invalid Categories" })
        );

      const productEdited = await this.productModel.editProduct({
        id,
        input: req.body,
      });

      if (!productEdited) return res.json({ message: "Product not found" });
      productEdited.categories = categories
      return res.json({
        message: "product edited successfuly",
        data: productEdited,
      });
    } catch (e) {
      throw new Error(`Error editing product: ${e.message}`);
    }
  };
  deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
      const isProductDelected = await this.productModel.deleteProduct({ id });
      if (!isProductDelected)
        return res.status(404).json({ message: "Product not found" });
      await this.productModel.deleteProduct_category({ id });
      res.json({ message: "Product delected successfuly" });
    } catch (e) {
      throw new Error("Error deleting product");
    }
  };
  createProduct_category = async ({ product_id, category }) => {
    return await this.productModel.createProduct_category({
      product_id,
      category,
    });
  };
  editProduct_category = async ({ id, categories }) => {
    await this.productModel.deleteProduct_category({ id });
    return Promise.all(
      categories.map(
        async (category) =>
          await this.createProduct_category({ product_id: id, category })
      )
    );
  };
}
