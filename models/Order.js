import { Schema, model } from "mongoose";

const OrderSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: "Product" },
  ordered_by: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: String },
});

const Order = model("Order", OrderSchema);

export default Order;
