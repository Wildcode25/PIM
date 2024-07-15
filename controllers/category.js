import { validateInput } from "./validateFunction.js";
import { createCategorySchema } from "../schemas/createCategory.js";
import { updateCategorySchema } from "../schemas/updateCategory.js";

export class CategoryController {
  constructor({ CategoryModel }) {
    this.categoryModel = new CategoryModel();
  }
  getCategory = async (req, res) => {
    const {name} = req.params;
    try{
        const category  = await this.categoryModel.getCategory({name});
        if(!category) return res.json({message: "Category not found"});
        res.json({
            data: category
        })
    }catch(e){
        console.error(`Error getting category: ${e.message}`)
    }

  };
  createCategory = async (req, res) => {
    const result = validateInput(createCategorySchema, req.body);

    try {
      if (result.success) {
        
        const createdCategory = await this.categoryModel.createCategory({
          input: result.data,
        });
        if(!createdCategory) return res.json("this category exist")
        return res.json({
          message: "category created successfuly",
          data: createdCategory,
        });
      }
      res.json(JSON.parse(result.error.message))
    } catch (e) {
        console.error(`Error creating category: ${e.message}`)
    }
  };
  updateCategory = async (req, res)=>{
    const {id} = req.params;
    try{
      const result = validateInput(updateCategorySchema, req.body);
      if(result.success){
        const editedCategory = await this.categoryModel.updateCategory({id, input: result.data});
        if(!editedCategory) return res.json({message: "The category doesn't exist"})
         return  res.json({
          message: "Category edited successfuly",
          data: editedCategory
        })

      }
      res.json(JSON.parse(result.error.message))
    }catch(e){
      console.error(`Error updating: ${e}`)
    }
    
  }
  deleteCategory = async (req, res)=>{
    const {id} = req.params;
    try{
      const deletedCategory = await this.categoryModel.deleteCategory({id});
      if(!deletedCategory) return res.json({message: "Category not found"});
      res.json({
        message: "Category deleted successfuly",
        data: deletedCategory
      })

    }catch(e){
      console.error(`Error deleting category: ${e.message}`)
    }

  }
}
