import Task from "../models/Task.js";

export const getDashboard = async (req, res) => {
  try {
    const tasks = await Task.find();

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "done").length;
    const pending = tasks.filter(t => t.status === "todo").length;

    res.json({
      total,
      completed,
      pending
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

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

