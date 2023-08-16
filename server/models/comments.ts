import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    post_id: String,
    uid: String,
    text: String,
    likes: Array,
    replies: Array,
    created_at: Number,
  },
)
export default mongoose.model("Comments", schema);
