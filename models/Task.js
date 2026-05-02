import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: Date
});

export default mongoose.model("Task", taskSchema);