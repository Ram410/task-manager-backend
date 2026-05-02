import Task from "../models/Task.js";

// ✅ CREATE TASK
export const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      projectId: req.body.projectId,
      completed: false,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET TASKS (BY PROJECT)
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ TOGGLE TASK (COMPLETE / INCOMPLETE)
export const toggleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    task.completed = !task.completed;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE TASK (OPTIONAL)
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};