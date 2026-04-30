import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

mongoose.connect("mongodb://krishna123:krishna410@ac-axuqmr7-shard-00-00.ff1pg2c.mongodb.net:27017,ac-axuqmr7-shard-00-01.ff1pg2c.mongodb.net:27017,ac-axuqmr7-shard-00-02.ff1pg2c.mongodb.net:27017/?ssl=true&replicaSet=atlas-yz1z1o-shard-0&authSource=admin&appName=Cluster0")
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch(err => console.log(err));