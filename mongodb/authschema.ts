import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  email: { type: String, required: true, unique: true },
  phonenumber: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  address: { type: String, default: "" },
  role: { type: String, default: "member" },
  credit: { type: Number, default: 0 },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
