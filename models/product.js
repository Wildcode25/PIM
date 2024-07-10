import { resolve } from "path";
import { pool } from "../config/db.js";

export class ProductModel {
  getAllProducts = async ({ page }) => {
    let products = [];

    try {
      const { rows } = (products = await this.getCategories(rows));
      return products;
    } catch (e) {
      throw new Error(`Error getting products of db: ${e}`);
    }
  };
  getProductById = async ({ id }) => {
    try {
      const products = await pool
        .query(`SELECT * FROM product WHERE id=$1`, [id])
        .then((data) => data.rows);

      if (products.length == 0) return null;
      const categories = await pool
        .query(`SELECT name FROM categories WHERE product_id=$1`, [id])
        .then((data) => data.rows);
      const product = {
        ...products[0],
        categories: categories.map((categorie) => categorie.name),
      };
      return product;
    } catch (error) {
      console.error(error.message);
    }
  };
  getProductsByCategory = async ({ category, page }) => {
    const offset = (page - 1) * 12;
    let products;
    try {
      if (category == "all") {
        products = await pool.query(`SELECT * FROM product ORDER BY id
        LIMIT 12 OFFSET ${offset}`).then(data=>data.rows);
        
      } else
        products = await pool
          .query(
            `SELECT p.id, p.name, p.description, p.price, p.stock FROM product p 
        INNER JOIN categories c ON p.id=c.product_id WHERE c.name = $1 ORDER BY id
                LIMIT 12 OFFSET $2`,
            [category, offset]
          )
          .then((data) => data.rows);

      products = await this.getCategories(products);
      return products;
    } catch (error) {
      console.error(`error getting products by category: ${error.message}`);
    }
  };
  createProduct = async ({ product }) => {
    const categories = product.categories;
    const { name, description, price, stock, customer_id } = product;
    try {
      await pool.query(
        `INSERT INTO product(name, description, price, stock, customer_id) 
                VALUES($1,$2,$3,$4,$5)`,
        [name, description, price, stock, customer_id]
      );
      const { rows } = await pool.query(
        `SELECT id FROM product ORDER BY id DESC LIMIT 1;`
      );
      categories.forEach(async (category) => {
        await pool.query(
          `INSERT INTO categories(name, product_id) 
                VALUES($1,$2)`,
          [category, rows[0].id]
        );
      });
    } catch (error) {
      throw new Error("error inserting product: " + error);
    }
  };

  editProduct = async ({ id, input }) => {
    try {
      const { rows } = await pool.query(
        `SELECT name, description, price, stock, customer_id
                FROM product WHERE id=$1`,
        [id]
      );

      if (rows.length == 0) return false;
      const productEdited = {
        ...rows[0],
        ...input,
      };
      const { name, description, price, stock, customer_id, categories } =
        productEdited;
      await pool.query(
        `UPDATE product 
                SET name=$1, description=$2, price=$3, stock=$4, customer_id=$5, updated_at=CURRENT_TIMESTAMP
                WHERE id=$6;`,
        [name, description, price, stock, customer_id, id]
      );
      if (categories != null) {
        await pool.query(`DELETE FROM categories WHERE product_id=$1;`, [id]);
        categories.forEach(async (categorie) => {
          await pool.query(
            `INSERT INTO categories(name, product_id) 
                VALUES($1,$2)`,
            [categorie, id]
          );
        });
      }
      return true;
    } catch (e) {
      throw new Error(`error updating db: ${e}`);
    }
  };
  deleteProduct = async ({ id }) => {
    try {
      await pool.query("DELETE FROM categories WHERE product_id=$1;", [id]);
      const { rowCount } = await pool.query(
        "DELETE FROM product WHERE id=$1;",
        [id]
      );
      return rowCount > 0 ? true : false;
    } catch (e) {
      console.error(e);
    }
  };
  async getCategories(products) {
    if (products.length == 0) return null;
    try {
      products = products.map(async (product) => {
        let categoriesNames = [];
        const { rows } = await pool.query(`SELECT name FROM categories 
                      WHERE ${product.id}=product_id`);

        categoriesNames = rows.map((categorie) => {
          return categorie.name;
        });
        return { ...product, categories: categoriesNames };
      });
    } catch (e) {
      console.error(`error getting category: ${e}`);
    }
    return Promise.all(products);
  }
}
