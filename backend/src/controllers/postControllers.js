import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

export const addPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const userId = req.user._id;

    const newPost = new Post({
      title: title,
      content: content,
    });

    newPost.userId = userId;

    const savedPost = await newPost.save();

    const user = await User.findById(userId);

    const comments = await Comment.find({ postId: savedPost._id });

    res.status(201).json({
      post: {
        _id: savedPost._id,
        title: savedPost.title,
        content: savedPost.content,
        userId: user,
        comments: comments,
        createdAt:savedPost.createdAt
      },
      msg: "New Post Created",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the post" });
  }
};

export const getPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("comments userId")
      .populate({ path: "comments", populate: { path: "userId" } })
      .sort({ createdAt: -1 })
      .exec();

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const userId = req.user._id;

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = new Comment({
      text: req.body.text,
      postId: post._id,
      userId,
    });

    const savedComment = await newComment.save();

    post.comments.push(savedComment._id);
    await post.save();

    const user = await User.findById(userId);
    savedComment.userId = user;
    res.status(201).json({comment:savedComment,msg:"Comment Added"});
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the comment" });
  }
};

export const search = async (req, res) => {
  try {
    const searchText = req.query.q;

    const regex = new RegExp(searchText, "i");

    const searchedPosts = await Post.find({
      $or: [{ title: regex }, { content: regex }],
    }).populate({ path: "comments", populate: { path: "userId" } }).populate("userId");

    const searchedComments = await Comment.find({ text: regex })
      .populate({ path: "postId", populate: { path: "comments", populate: { path: "userId" } } });

    const uniquePosts = [];

    searchedPosts.forEach(post => {
      if (!uniquePosts.some(existingPost => existingPost._id === post._id)) {
        uniquePosts.push(post);
      }
    });

    searchedComments.forEach(comment => {
      const post = comment.postId;
      if (post && !uniquePosts.some(existingPost => existingPost._id === post._id)) {
        uniquePosts.push(post);
      }
    });
    
    res.json({ posts: uniquePosts });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while performing the search" });
  }
};
