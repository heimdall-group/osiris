import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    type: String,
    uid: String,
    urls: Array<String>,
    likes_total: Number,
    comments_total: Number,
    caption: String,
    users_taged: Array,
    published: Boolean,
    upload_id: String,
    created_at: Number,
  },
)
export default mongoose.model("Posts", schema);
