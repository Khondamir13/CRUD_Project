import { Schema, model } from "mongoose";

const OrderSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: "Product" },
  ordered_by: { type: Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["active", "deactive", "pending"],
    required: true,
  },
});

const Order = model("Order", OrderSchema);

export default Order;
