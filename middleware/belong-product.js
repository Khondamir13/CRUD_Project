import Product from "../models/Product.js";
export default async function (req, res, next) {
  const id = req.params.id;
  const product = await Product.findById(id);
  if (product) {
    if (product.user.toString() === req.userId.toString()) {
      next();
    } else {
      res.redirect("/");
      return;
    }
  }
}
