import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const { host, port, name } = mongoose.connection;
    console.log(`MongoDB connected: ${host}:${port}/${name}`);
  } catch (err) {
    console.log("DB connection failed", err.message);
    process.exit(1); //use it only wehn core dependency is missing, like db connection
  }
};
