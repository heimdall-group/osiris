import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    user_handle: {
      type: String, 
      unique: true,
    },
    user_uid: {
      type: String, 
      unique: true,
    },
    user_email: String,
    user_ranks: Array,
    user_followers: Array,
    user_following: Array,
    user_programs: Array,
    users_blocked: Array,
    user_avatar: String,
    user_verified: Boolean,
    user_description: String,
    user_created_at: String,
  },
)
export default mongoose.model("Users", UserSchema);
