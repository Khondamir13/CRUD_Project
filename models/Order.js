import { Schema, model } from "mongoose";

const OrderSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: "Product" },
  ordered_by: { type: Schema.Types.ObjectId, ref: "User" },
  address: { type: String, required: true },
  count: { type: Number, required: true },
  status: {
    type: String,
    enum: ["active", "deactive", "pending"],
    required: true,
  },
  pay: {
    type: String,
    enum: ["Visa", "Uzcard", "Humo"],
    required: true,
  },
  card_number: { type: Number, required: true },
});

const Order = model("Order", OrderSchema);

export default Order;
