import { Router } from "express";
import { signup,login,refreshToken,getUser ,logout} from "../controllers/authControllers.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

//add entry user
router.post("/signup", (req, res) => {
  signup(req, res);
});

router.post("/login", (req, res) => {
    login(req, res);
});

//refresh-token
router.post("/refresh-token",(req, res) => {
  refreshToken(req, res);
});

//get user
router.get("/user", auth,(req, res) => {
  getUser(req, res);
});

router.post("/logout",(req, res) => {
  logout(req, res);
});
export default router;