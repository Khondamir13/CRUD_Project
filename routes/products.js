import { Router } from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/auth.js";
import userMiddleware from "../middleware/user.js";

const router = Router();
router.get("/", async (req, res) => {
  const products = await Product.find({ status: "active" }).lean();
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

router.get("/edit-product/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate("user").lean();

  res.render("edit-product", {
    title: "Edit | App",
    product: product,
    editProductError: req.flash("editProductError"),
  });
});

router.post("/add-products", userMiddleware, async (req, res) => {
  const { title, description, image, price, tag } = req.body;
  if (!title || !description || !image || !price || !tag) {
    req.flash("addProductError", "All fields must be filled");
    res.redirect("/add");
    return;
  }
  const tag_array = [tag];
  await Product.create({ ...req.body, user: req.userId, status: "pending", tags: tag_array });
  res.redirect("/");
});

router.post("/edit-product/:id", authMiddleware, async (req, res) => {
  const { title, description, image, price, delete_tag, add_tag } = req.body;
  const id = req.params.id;
  if (!title || !description || !image || !price) {
    req.flash("editProductError", "All fields must be filled without Tags ");
    res.redirect(`/edit-product/${id}`);
    return;
  }
  if (add_tag) {
    const product = await Product.findById(id);
    product.tags.push(add_tag);
    await product.save();
  }

  if (delete_tag) {
    const product = await Product.findById(id);
    const length = product.tags.length;
    product.tags.forEach(async (result, index) => {
      if (result === delete_tag) {
        product.tags.splice(index, 1);
        await product.save();
      }
    });
    if (length === product.tags.length) {
      req.flash("editProductError", "Tag names you want to delete, it should be the same as the one shown in the list ");
      res.redirect(`/edit-product/${id}`);
      return;
    }
  }

  await Product.findByIdAndUpdate(id, req.body, { new: true });
  res.redirect("/products");
});

router.post("/delete-product/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;

  await Product.findByIdAndDelete(id);
  res.redirect("/");
});

export default router;
