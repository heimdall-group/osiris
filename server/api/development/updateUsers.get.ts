import Users from "~/server/models/users";

export default defineEventHandler(async () => {
  const document = await Users.updateMany({
    user_unpublished_posts: [],
  });

  return {
    data: true,
    success: true,
  }
  
})