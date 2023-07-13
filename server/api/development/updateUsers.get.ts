import Users from "~/server/models/users";

export default defineEventHandler(async () => {
  const document = await Users.updateMany({
    users_blocked: [],
  });

  return {
    data: true,
    success: true,
  }
  
})