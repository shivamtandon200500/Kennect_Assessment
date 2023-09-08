import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String, 
      required: true
    },
    token_version: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
