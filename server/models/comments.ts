import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    post_id: String,
    uid: String,
    text: String,
    likes: Array,
    likes_count: Number,
    replies: Array,
    reply_count: Number,
    created_at: Number,
  },
)
export default mongoose.model("", schema);
