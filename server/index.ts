import { initializeApp, cert } from "firebase-admin/app";
import mongoose from "mongoose";

initializeApp({
  credential: cert('./cert.json')
})

const config = useRuntimeConfig();

export default async () => {
  try {
    await mongoose.connect(config.db_url);
    console.log("DB connection true");
  } catch (error) {
    console.error("DB connection false", error);
  }
};