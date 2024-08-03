import connectDB from "./db/index.js";
import app from "./app.js";
import "dotenv/config";
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("App running at port: ", PORT);
    });
  })
  .catch((err) => {
    console.log("mongoDb connection failed", err);
  });
