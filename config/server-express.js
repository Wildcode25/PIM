import express from "express";
import cookieParser from "cookie-parser";
import { createdHomeRouter } from "../routes/home.js";
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

  //TODO: remove console.log
  console.log(token);
  if (token) {
    // TODO: should handle error if token is invalid or expired probably with try catch
    const data = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.session.user = data;
  }
  next();
});
expressApp.get("/", (req, res) => res.json({ message: "welcome" }));
expressApp.use("/users", createUserRouter({ UserModel }));
// TODO: if use ProductModel, it should be on /products route
// TODO: it was requested to have a products route
expressApp.use("/home", createdHomeRouter({ ProductModel }));
// TODO: it was requested to have a categories route

export default expressApp;
