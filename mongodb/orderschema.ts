import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    order: [
      {
        productname: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalprice: { type: Number, required: true },
    status: { type: Boolean, default: false },
    userref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
