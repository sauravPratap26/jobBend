import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js"
import companyRouter from "./routes/company.routes.js"
import jobRouter from "./routes/job.routes.js"
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users",userRouter)
app.use("/api/v1/company",companyRouter)
app.use("/api/v1/job",jobRouter)

export default app;
