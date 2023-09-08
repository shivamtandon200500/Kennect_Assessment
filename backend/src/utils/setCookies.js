import { createRefreshToken } from "./authTokens.js";

export const setCookies = (res, user) => {
  const token = createRefreshToken(user);
  res.cookie("Kennect", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: false,
    sameSite: "lax",
  });
};