import { Router } from "express";
import { addComment, addPost,getPost,search } from "../controllers/postControllers.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

//add Post
router.post("/addPost", auth, (req, res) => {
  addPost(req, res);
});

//get all Posts
router.get("/get-posts", (req, res) => {
  getPost(req, res);
});

//add comment
router.post('/posts/:postId/comments', auth, (req, res) => {
  addComment(req, res);
});

//search
router.get('/search', (req, res) => {
  search(req, res);
});
export default router;