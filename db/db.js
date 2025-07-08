import { mongoose } from "@/models/mongoose";

let isConnected; // Flag to check if the connection is established

export async function connect() {
  if (isConnected) {
    console.log("Database is already connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
    });
    isConnected = db.connection.readyState === 1;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database", error);
  }
}
