import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    uid: String,
    urls: Array<String>,
    likes: Array<String>,
    comments: Array<String>,
    caption: String,
    users_taged: Array,
    published: Boolean,
    created_at: Number,
  },
)
export default mongoose.model("Posts", schema);
