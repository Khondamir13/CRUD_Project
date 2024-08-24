import Order from "../models/Order.js";
export default async function (req, res, next) {
  const id = req.params.id;
  const order = await Order.findById(id);
  if (order) {
    if (order.ordered_by.toString() === req.userId.toString()) {
      next();
    } else {
      res.redirect("/");
      return;
    }
  }
}
