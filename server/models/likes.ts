import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    post_id: String,
    uid: String,
    created_at: Number,
  },
)
export default mongoose.model("Likes", schema);
