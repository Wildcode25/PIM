import { resolve } from "path";
import { pool } from "../config/db.js";

export class ProductModel {
  getAllProducts = async ({ offset }) => {

    try {
      const products = await pool
          .query(
            `SELECT p.id, p.name, p.description, p.price, p.stock FROM product p 
                LIMIT 12 OFFSET $1`,
            [offset]
          )
          .then((data) => data.rows);
      return products;
    } catch (e) {
      throw new Error(`Error getting products of db: ${e}`);
    }
  };
 
  getProductsByCategory = async ({ category, offset }) => {
    try {
        const products = await pool
          .query(
            `SELECT p.id, p.name, p.description, p.price, p.stock, p.customer_id FROM product p 
        INNER JOIN product_category pc ON p.id=pc.product_id WHERE pc.category_id = (SELECT id FROM category WHERE name=$1) ORDER BY p.id
                LIMIT 12 OFFSET $2`,
            [category, offset]
          )
          .then((data) => data.rows);
      return products;
    } catch (error) {
      console.error(`error getting products by category: ${error.message}`);
    }
  };
  createProduct = async ({ product }) => {
    const { name, description, price, stock, customer_id } = product;
    try {
      const createdProduct = await pool.query(
        `INSERT INTO product(name, description, price, stock, customer_id) 
                VALUES($1,$2,$3,$4,$5) RETURNING id, name, description, price, stock, customer_id`,
        [name, description, price, stock, customer_id]
      ).then(data=>data.rows[0]);
      return createdProduct;
    } catch (error) {
      throw new Error("error inserting product: " + error);
    }
  };

  editProduct = async ({ id, input }) => {
    try {
      const product = await pool.query(
        `SELECT name, description, price, stock, customer_id
                FROM product WHERE id=$1`,
        [id]
      ).then(data=>data.rows[0]);
      const newProduct = {
        ...product,
        ...input,
      };
      const { name, description, price, stock, customer_id } =
        newProduct;
      const productEdited = await pool.query(
        `UPDATE product 
                SET name=$1, description=$2, price=$3, stock=$4, customer_id=$5, updated_at=CURRENT_TIMESTAMP
                WHERE id=$6 RETURNING name, description, price, stock, customer_id;`,
        [name, description, price, stock, customer_id, id]
      ).then(data=>data.rows[0]);
      return productEdited;
    } catch (e) {
      throw new Error(`error updating db: ${e}`);
    }
  };
  deleteProduct = async ({ id }) => {
    try {
      await pool.query("DELETE FROM product_category WHERE product_id=$1",
        [id]
      )
      const { rowCount } = await pool.query(
        "DELETE FROM product WHERE id=$1;",
        [id]
      );
      return rowCount;
    } catch (e) {
      console.error(e.message);
    }
  };
  async getCategories({id}) {
    try {
      
        const categoriesNames = await pool.query(`SELECT name FROM category c
                      INNER JOIN PRODUCT_CATEGORY pc ON c.id=pc.category_id WHERE pc.product_id=$1`,[id]).then(data=>data.rows);

        return categoriesNames;
    } catch (e) {
      console.error(`error getting category: ${e}`);
    }
  }
  createProduct_category = async ({product_id, category})=>{
    try{
      const product_category = await pool.query(`INSERT INTO product_category(product_id, category_id) VALUES($1, (SELECT id FROM category WHERE name=$2))
        RETURNING product_id, category_id;`,
        [product_id, category]
      ).then(data=>data.rows[0]);
      return product_category;
    }catch(e){
      console.error(`Error updating product_category ${e.message}`)
    }
  }
  deleteProduct_category = async ({id})=>{
    try{
      await pool.query("DELETE FROM product_category WHERE product_id=$1",
        [id]
      )
    }catch(e){
      console.error(`Error deleting from product_category: ${e.message}`)
    }
  }
}
