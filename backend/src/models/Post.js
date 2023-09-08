import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: [],
      required: true
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });


const Post = mongoose.model("Post", PostSchema);

export default Post;
