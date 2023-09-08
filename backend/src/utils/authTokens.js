import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../constants.js";

export const createAccessToken = (user) => {
  const payload = {
    _id: user._id,
    token_version: user.token_version,
  };
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const createRefreshToken = (user) => {
  const payload = {
    _id: user._id,
    token_version: user.token_version,
  };
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
