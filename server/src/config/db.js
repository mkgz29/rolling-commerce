import mongoose from "mongoose";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");
// Usar un DNS público para consultas SRV de MongoDB Atlas
dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("Mongoose disconnected from DB");
});

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI?.trim();

  if (!mongoUri) {
    console.error(
      "Missing required environment variable MONGO_URI. Add it to server/.env before starting the backend."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
  } catch (error) {
    console.error("Critical error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
