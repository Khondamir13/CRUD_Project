import { Router } from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/auth.js";
import userMiddleware from "../middleware/user.js";

const router = Router();
router.get("/", async (req, res) => {
  const products = await Product.find().lean();
  res.render("index", {
    title: "Boom shop | App",
    products: products.reverse(),
    userId: req.userId ? req.userId.toString() : null,
  });
});
router.get("/products", async (req, res) => {
  const user = req.userId ? req.userId.toString() : null;
  const myProducts = await Product.find({ user: user }).populate("user").lean();
  res.render("products", {
    title: "Products | App",
    isProducts: true,
    myProducts: myProducts,
  });
});
router.get("/add", authMiddleware, (req, res) => {
  res.render("add", {
    title: "Add | App",
    isAdd: true,
    addProductError: req.flash("addProductError"),
  });
});

router.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate("user").lean();

  res.render("product", {
    title: "Detail | App",
    product: product,
  });
});

router.post("/add-products", userMiddleware, async (req, res) => {
  const { title, description, image, price } = req.body;
  if (!title || !description || !image || !price) {
    req.flash("addProductError", "All fields must be filled");
    res.redirect("/add");
    return;
  }
  await Product.create({ ...req.body, user: req.userId });
  res.redirect("/");
});

export default router;
