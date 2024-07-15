import express from "express";
import cookieParser from "cookie-parser";
import { createProductRouter } from "../routes/product.js";
import { createUserRouter } from "../routes/userManagement.js";
import { ProductModel } from "../models/product.js";
import { UserModel } from "../models/user.js";
import { CategoryModel } from "../models/category.js";
import { createCategoryRouter } from "../routes/category.js";
import jwt from "jsonwebtoken";

const expressApp = express();
expressApp.use(express.json());
expressApp.use(cookieParser());
expressApp.use((req, res, next) => {
  req.session = { user: null };
  const token = req.cookies.access_token;

  if (token) {
    try {
      const data = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      req.session.user = data;
    } catch (e) {
      console.error(`Error verifying token: ${e.message}`);
    }
  }
  next();
});

expressApp.use("/", createUserRouter({ UserModel }));
expressApp.use((req, res, next) => {
  const { user } = req.session;
  if (!user)
    return res.json({
      message: "access declined",
    });
  next();
});
expressApp.use("/products", createProductRouter({ ProductModel }));
expressApp.use("/categories", createCategoryRouter({ CategoryModel }));
export default expressApp;
