import { pool } from "../db/db.js";

export class ProductModel{
    getAllProducts = async ({page})=> {
        try{
            const offset = (page-1)*12;
            const {rows} = await pool.query(`SELECT * FROM product ORDER BY id
                LIMIT 12 OFFSET ${offset}`);

            if(rows.length==0) return [];
        
            return rows;
        }catch(error){
            console.error(error.message)
        }


    }
    getProductById = async ({id})=>{
        try{
            const {rows} = await pool.query(`SELECT * FROM product WHERE id=?`,
                [id]
            );

            if(rows.length==0) return [];
        
            return rows[0];
        }catch(error){
            console.error(error.message)
        }
    }
    createProduct = async ({product})=>{

        try{
            await pool.query(`INSERT INTO product(name, description, price, stock, customer_id) 
                VALUES($1,$2,$3,$4,$5)`, Object.values(product));
        }catch(error){
            throw new Error('error creating product: '+error)
        }

    }

    editProduct = async ({input})=>{
        const {id} = input;
        const [rows] = await pool.query("SELECT * FRON product WHERE id=?", [id]);
        const product = rows[0];
        product = {
            ...product,
            ...input
        }

        await pool.query(`UPDATE product 
            SET name=$1, description=$2, price=$3, stock=$4, customer_id=$5, update_at=CURRENT_TIMESTAMP`,
            Object.values(product)
        )
    }
    deleteProduct = async ({id})=>{
        try{
            await pool.query("DELETE FROM product WHERE id=$1", [id])
        }catch(e){
            console.error(e)
        }
    }
}