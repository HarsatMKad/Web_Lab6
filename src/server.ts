import mongoose from "mongoose";
import app from "./app";
import "dotenv/config";

const port = process.env.PORT || 3000;
const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017";

const start = async () => {
  try {
    await mongoose.connect(dbUrl!);
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
