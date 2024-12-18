import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  token: {
    type: String,
    default: null,
  },
});

export default model("User", userSchema);
