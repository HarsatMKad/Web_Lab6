import mongoose from "mongoose";
import app from "./app";
import "dotenv/config";

const port = process.env.PORT;
const dbUrl = process.env.MONGO_URL;

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
