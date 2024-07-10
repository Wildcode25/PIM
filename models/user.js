import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
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
      const { rowCount } = await pool.query(
        "SELECT * FROM customer WHERE email=$1",
        [email]
      );
      // TODO: checking for user existance should be handled in the controller not in the model
      // TODO: model should only interact with the database
      if (rowCount > 0) return { message: "user already exists" };
      // TODO: hash password should be done in the controller not in the model
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        "INSERT INTO customer(name, email, password) VALUES($1, $2, $3)",
        [name, email, hashedPassword]
      );
      return { message: "User registed successfuly" };
    } catch (e) {
      throw new Error(`error creating user: ${e.message}`);
    }
  };
  loginUser = async ({ input }) => {
    const { email, password } = input;
    try {
      const { rows } = await pool.query(
        "SELECT * FROM customer WHERE email=$1",
        [email]
      );
      // TODO: checking for user existance should be handled in the controller not in the model
      if (rows.length == 0) return { message: "user doesn't exist" };
      // TODO: compare password should be done in the controller not in the model
      const isValid = await bcrypt.compare(password, rows[0].password);
      if (!isValid) return { message: "Incorrect password" };
      
      const {password: _, ...user }=rows[0];
      return user;
    } catch (e) {
      console.error(e.message);
    }
  };
}
