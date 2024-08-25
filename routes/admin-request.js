import { Router } from "express";
import isAdmin from "../middleware/check-admin.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
const router = Router();

router.get("/admin/orders", isAdmin, async (req, res) => {
  const orders = await Order.find().populate(["product_id", "ordered_by"]).lean();
  res.render("admin-orders", {
    title: "Orders | App",
    orders: orders.reverse(),
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

// Delete

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

// Edit
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
  if (!title || !description || !price) {
    req.flash("changeProduct", "All fields must be filled");
    res.redirect(`/admin/edit-product/${id}`);
    return;
  }
  await Product.findByIdAndUpdate(id, req.body, { new: true });

  res.redirect("/admin/products");
});

// Change Order status
router.get("/admin/active-order/:id", isAdmin, async (req, res) => {
  const id = req.params.id;
  const order = await Order.findById(id).populate("product_id");
  const product = await Product.findById(order.product_id._id);
  await product.updateOne({ $inc: { order_count: 1 } });
  order.status = "active";
  await order.save();
  res.redirect("/admin/orders");
});

router.get("/admin/inactive-order/:id", isAdmin, async (req, res) => {
  const id = req.params.id;
  const order = await Order.findById(id);
  order.status = "inactive";
  await order.save();
  res.redirect("/admin/orders");
});

router.get("/admin/pending-order/:id", isAdmin, async (req, res) => {
  const id = req.params.id;
  const order = await Order.findById(id);
  order.status = "pending";
  await order.save();
  res.redirect("/admin/orders");
});

export default router;
