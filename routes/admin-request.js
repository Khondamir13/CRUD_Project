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

router.get("/delete-user/:id", isAdmin, async (req, res) => {
  const id = req.params.id;
  await User.findByIdAndDelete(id);
  res.redirect("/admin/users");
});
export default router;
