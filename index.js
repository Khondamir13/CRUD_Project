import express from "express";
import { create } from "express-handlebars";
import mongoose from "mongoose";
import flash from "connect-flash"; //VALIDATION package
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import session from "express-session";

// Middlewares
import varMiddleware from "./middleware/var.js";
import userMiddleware from "./middleware/user.js";
import hbsHelper from "./utils/index.js";
//Routes
import Authroutes from "./routes/auth.js";
import ProductsRoutes from "./routes/products.js";
import AdminRoutes from "./routes/admin-request.js";

dotenv.config();

const app = express();

//  HBS CONFIG
const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: hbsHelper,
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: "Xondamir", resave: false, saveUninitialized: false }));
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);
// ROUTES
app.use(Authroutes);
app.use(ProductsRoutes);
app.use(AdminRoutes);

// CONNECTION

const startApp = () => {
  try {
    const PORT = process.env.PORT || 4100;
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URL);

    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}-port`);
    });
  } catch (error) {
    console.log(error);
  }
};

startApp();
