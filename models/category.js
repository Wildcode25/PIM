import { pool } from "../config/db.js";

export class CategoryModel{
    getCategory = async ({name})=>{
        try{
            const {rows} = await pool.query("SELECT * FROM category WHERE name=$1",
                [name]
            )
            return rows[0]
        }catch(e){

            console.error(`Error getting category in db: ${e.message}`)
        }
    }
    createCategory = async ({input})=>{
        const {
            name,
            description
        } = input
        try{
            const createdCategory = await pool.query("INSERT INTO category(name,description) VALUES($1,$2) RETURNING name, description",
                [name, description]
            ).then(data=>data.rows[0])
            return createdCategory;
        }catch(e){
            console.error(`Error creating category in db: ${e.message}`)
        }
    }
    updateCategory = async ({id, input})=>{
       
        try{
            const category = await pool.query("SELECT * FROM category WHERE id=$1",
                [id]
            ).then( data => data.rows[0] );
            let newCategory = {
                ...category, ...input
            }
            const {
                name,
                description
            } = newCategory
            const editedCategory = await pool.query("UPDATE category SET name=$1, description=$2 WHERE id=$3 RETURNING name, description",
                [name, description, id]
            ).then(data => data.rows[0])
            return editedCategory;
        }catch(e){
            console.error(`Error updating category in db: ${e.message}`)
        }
    }
    deleteCategory = async ({id})=>{
        try{
            const delectedCategory = await pool.query("DELETE FROM category WHERE id=$1 RETURNING name, description",
                [id]
            ).then(data => data.rows[0])
            return delectedCategory;
        }
        catch(e){
            console.error(`Error deleting category: ${e.message}`)
        }
        
    }
}