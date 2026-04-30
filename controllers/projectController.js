import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      createdBy: req.user.id,
      members: []
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjects = async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
};