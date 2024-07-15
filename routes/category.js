import { Router } from "express";
import { CategoryController } from "../controllers/category.js";

export const createCategoryRouter = ({CategoryModel})=>{
    const categoryRouter = new Router();
    const categoryController = new CategoryController({CategoryModel});

    categoryRouter.get('/:name', categoryController.getCategory)
    categoryRouter.post('/', categoryController.createCategory)
    categoryRouter.put('/:id', categoryController.updateCategory)
    categoryRouter.delete('/:id', categoryController.deleteCategory)

    return categoryRouter;
}