import { Router } from "express";
import isAdmin from "../middleware/check-admin.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
const router = Router();

router.get("/admin/orders", isAdmin, (req, res) => {
  res.render("admin-orders", {
    title: "Orders | App",
    isAdminOrders: true,
  });
});

router.get("/admin/users", isAdmin, async (req, res) => {
  const users = await User.find().lean();
  res.render("admin-users", {
    title: "Users | App",
    isAdminUsers: true,
    users: users.reverse(),
  });
});

router.get("/admin/products", isAdmin, async (req, res) => {
  const products = await Product.find().lean().populate("user");
  res.render("admin-products", {
    title: "Products | App",
    isAdminProducts: true,
    products: products.reverse(),
  });
});

router.get("/admin/delete-user/:id", isAdmin, async (req, res) => {
  const id = req.params.id;
  await User.findByIdAndDelete(id);
  res.redirect("/admin/users");
});

router.get("/admin/delete-product/:id", isAdmin, async (req, res) => {
  const id = req.params.id;
  await Product.findByIdAndDelete(id);
  res.redirect("/admin/products");
});

router.get("/admin/edit-product/:id", isAdmin, async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id).lean();

  res.render("admin-edit-product", {
    title: "Edit | App",
    product: product,
    changeProduct: req.flash("changeProduct"),
  });
});

router.post("/admin/edit-product/:id", isAdmin, async (req, res) => {
  const { title, description, price, status } = req.body;
  const id = req.params.id;
  if (status == "active" || status == "inactive" || status == "pending") {
    if (!title || !description || !price) {
      req.flash("changeProduct", "All fields must be filled");
      res.redirect(`/admin/edit-product/${id}`);
      return;
    }
  } else {
    req.flash("changeProduct", "Check status, You should choose three options ");
    res.redirect(`/admin/edit-product/${id}`);
    return;
  }

  await Product.findByIdAndUpdate(id, req.body, { new: true });

  res.redirect("/admin/products");
});

export default router;
