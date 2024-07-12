import express from "express";
import cookieParser from "cookie-parser";
import { createdHomeRouter } from "../routes/producto.js";
import { createUserRouter } from "../routes/userManagement.js";
import { ProductModel } from "../models/product.js";
import { UserModel } from "../models/user.js";
import jwt from "jsonwebtoken";

const expressApp = express();
expressApp.use(express.json());
expressApp.use(cookieParser());
expressApp.use((req, res, next) => {
  req.session = { user: null };
  const token = req.cookies.access_token;

  console.log(token);
  if (token) {
    const data = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.session.user = data;
  }
  next();
});
expressApp.get("/", (req, res) => res.json({ message: "welcome" }));
expressApp.use("/users", createUserRouter({ UserModel }));
expressApp.use("/home", createdProductRouter({ ProductModel }));

export default expressApp;
