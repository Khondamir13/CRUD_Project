import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      required: true,
    },
    tags: [String],
    order_count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = model("Product", ProductSchema);

export default Product;
