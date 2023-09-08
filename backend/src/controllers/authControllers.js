import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import { createAccessToken } from "../utils/authTokens.js";
import { hashPassword } from "../utils/hashPassword.js";
import { setCookies } from "../utils/setCookies.js";
import { REFRESH_TOKEN_SECRET} from "../constants.js";
import jwt from "jsonwebtoken";


export const signup = async (req, res) => {
    try {
      const { name, password, email } = req.body;
  
      if (!name || !email || !password) {
        return res.status(200).json({
          error: "Please fill in all the fields.",
        });
      }
  
      // Validate input fields
      if (!name || name.length < 3) {
        return res
          .status(200)
          .json({ error: "Name must be minimum of 3 letters" });
      }
  
      if (!password || password.length < 3) {
        return res
          .status(200)
          .json({ error: "Password must be minimum of 3 letters" });
      }
  
      const user = await User.findOne({ email }).exec();
  
      if (user) {
        return res.status(400).json({
          error: "User already exists",
        });
      }
  
      try {
        const newUser = new User({
          name,
          email,
          password: await hashPassword(password),
        });
  
        await newUser.save();
  
        const repUser = newUser.toObject();
        delete repUser.password;

        return res.status(200).json({
          msg: "User created.",
        });
      } catch (err) {
        console.log(err);
        return res.status(400).json({
          error: "Error creating user.",
        });
      }
    } catch (err) {
      return res.status(400).json({
        error: "Error creating user.",
      });
    }
};

export const login = async (req, res) => {
    try {
      const { email, password} = req.body;
      if (!email || !password) {
        return res.status(400).json({
          error: "Please fill in all the fields.",
        });
      }
  
      let user = await User.findOne({ email }).exec();
  
      if (!user) {
        return res.status(400).json({
          error: "User does not exist.",
        });
      }
  
      const isAuth = await bcryptjs.compare(password, user.password);
  
      if (!isAuth) {
        return res.status(400).json({
          error: "Invalid password.",
        });
      }
      setCookies(res, user);
  
      const repUser = user.toObject();
      delete repUser.password;
  
      return res.status(200).json({
        user: repUser,
        accessToken: createAccessToken(user),
        msg: "User logged in.",
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: "Error logging in.",
      });
    }
  };

  export const refreshToken = async (req, res) => {
    const token = req.cookies.Kennect;
    let payload;
    try {
      if (!token) {
        throw new Error("No token");
      }
      try {
        payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
      } catch (err) {
        console.log(err);
        throw new Error("Invalid token");
      }
      const user = await User.findById(payload._id).exec();
      if (!user) {
        throw new Error("User does not exist");
      }
      if (user.token_version !== payload.token_version) {
        throw new Error("Token version not matched");
      }
      setCookies(res, user);
      return res.status(200).json({
        accessToken: createAccessToken(user),
        msg: "Token refreshed.",
      });
    } catch (err) {
      res.clearCookie("Kennect");
      return res.status(401).json({
        authFailed: true,
        error: err.message,
      });
    }
  };

export const getUser = async (req,res) => {
  try {
    const u = req.user;
    const user = await User.findById(u._id).exec();
    const repUser = user.toObject();
    delete repUser.password;

    if (user) {
      res.status(200).json({
        user: repUser,
        accessToken: createAccessToken(user),
      });
    } else {
      res.status(400).json({
        error: "User does not exist.",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "Could not fetch user.",
    });
  }
}

export const logout = async (req, res) => {
  try {
    res.cookie("Kennect", "", {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: false,
      sameSite: "lax",
    });
    return res.status(200).json({
      msg: "User logged out.",
    });
    res.end();
  } catch (err) {
    return res.status(400).json({
      error: "Error logging out.",
    });
  }
};