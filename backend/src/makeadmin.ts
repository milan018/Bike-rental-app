/*import mongoose from "mongoose";
import User from "./models/user";
import * as dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env
async function makeUserAdmin(userId: string) {
  try {
    await mongoose.connect("process.env.MONGODB_CONNECTION_STRING as string"); // Replace with your connection string
    const user = await User.findByIdAndUpdate(userId, { isAdmin: true });
    if (user) {
      console.log("User updated successfully");
    } else {
      console.log("User not found");
    }
    mongoose.disconnect();
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

// Example usage:
makeUserAdmin("6785ff792b8b66372b600f87");
*/
