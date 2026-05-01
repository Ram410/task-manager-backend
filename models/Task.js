import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },
  completed: Boolean
});

export default mongoose.model("Task", taskSchema);