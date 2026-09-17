const ProjectModel = require('../models/projectModel');

class ProjectController {
  static async getAllProjects(req, res) {
    try {
      const projects = await ProjectModel.findAll();
      res.json({ success: true, data: projects });
    } catch (error) {
      console.error('[ProjectController Error]', error);
      res.status(500).json({ success: false, message: 'Failed to fetch projects', error: error.message });
    }
  }

  static async getProjectById(req, res) {
    try {
      const { id } = req.params;
      const project = await ProjectModel.findById(id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      res.json({ success: true, data: project });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch project', error: error.message });
    }
  }

  static async createProject(req, res) {
    try {
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: 'Project name is required' });
      }

      const newProject = await ProjectModel.create({ name, description });
      res.status(201).json({ success: true, data: newProject, message: 'Project created successfully' });
    } catch (error) {
      console.error('[ProjectController Error]', error);
      res.status(500).json({ success: false, message: 'Failed to create project', error: error.message });
    }
  }

  static async addMemberToProject(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }

      const result = await ProjectModel.addMember(id, userId);
      res.json({ success: true, data: result, message: 'User added to project successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to add member', error: error.message });
    }
  }

  static async getProjectMembers(req, res) {
    try {
      const { id } = req.params;
      const members = await ProjectModel.getMembers(id);
      res.json({ success: true, data: members });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch project members', error: error.message });
    }
  }
}

module.exports = ProjectController;
