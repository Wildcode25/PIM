import { pool } from "../config/db.js";
export class UserModel {
  getUser = async ({ id }) => {
    try {
      const { rows } = await pool.query("SELECT * FROM customer WHERE id=$1", [
        id,
      ]);
      if (rows.length == 0) return null;

      return rows[0];
    } catch (e) {
      throw new Error("error getting user");
    }
  };
  getUsers = async () => {
    try {
      const { rows } = await pool.query("SELECT * FROM customer");
      if (rows.length) return rows;
      return [];
    } catch (e) {
      throw new Error("error getting users");
    }
  };
  createUser = async ({ input }) => {
    const { name, email, password } = input;
    try {
      const createdUser = await pool.query(
        "INSERT INTO customer(name, email, password) VALUES($1, $2, $3) RETURNING name, email",
        [name, email, password]
      ).then( data => data.rows[0] );
      return createdUser;
    } catch (e) {
      console.error(`error creating user: ${e.message}`)
      
    }
  };
  loginUser = async ({ email }) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM customer WHERE email=$1",
        [email]
      );
      return rows[0]
    } catch (e) {
      console.error(e.message);
    }
  };
}
