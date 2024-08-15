import { Router } from "express";
import isAdmin from "../middleware/check-admin.js";
const router = Router();

router.get("/admin/orders", isAdmin, (req, res) => {
  res.render("admin-orders", {
    title: "Orders | App",
    isAdminOrders: true,
  });
});

router.get("/admin/users", isAdmin, (req, res) => {
  res.render("admin-users", {
    title: "Users | App",
    isAdminUsers: true,
  });
});

router.get("/admin/products", isAdmin, (req, res) => {
  res.render("admin-products", {
    title: "Products | App",
    isAdminProducts: true,
  });
});

export default router;
