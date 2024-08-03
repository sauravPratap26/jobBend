import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectInstance = await mongoose.connect(
      `${process.env.MONGO_DB_URI}/JobPortal`
    );
    console.log("\nMongoDb connected: ", connectInstance.connection.host);
  } catch (error) {
    console.log("Error connecting to the DB, error:\n", error);
  }
};

export default connectDB;
