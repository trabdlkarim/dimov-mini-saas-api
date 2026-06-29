import service from "../services/projectService.js";

const projectController = {
  async listProjects(req, res) {
    try {
      const { search, filter, expand } = req.query;
      let projects = [];
      if (search) {
        projects = await service.searchProjects(search);
      } else if (filter) {
        projects = await service.filterProjects(filter);
      } else {
        projects = await service.getProjects();
      }

      // Load project possible relations
      if (projects && expand) {
        projects = await service.expandRelations(projects, expand);
      }

      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getProject(req, res) {
    try {
      const { id } = req.params;
      const project = await service.getProjectById(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createProject(req, res) {
    try {
      const projectData = req.body;
      const newProject = await service.createProject(projectData);
      res.status(201).json(newProject);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateProject(req, res) {
    try {
      const { id } = req.params;
      const projectData = req.body;
      const updated = await service.updateProject(id, projectData);
      if (!updated || updated.length === 0) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteProject(req, res) {
    try {
      const { id } = req.params;
      const result = await service.deleteProject(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default projectController;
