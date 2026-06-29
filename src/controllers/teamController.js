import service from "../services/teamService.js";

const teamController = {
  async listTeams(req, res) {
    const { expand } = req.query;
    try {
      const teams = await service.getTeams();
      for (const team of teams) {
        if (expand) {
          const relations = expand.split(",");
          for (const relation of relations) {
            let [field, alias] = relation.split(":");
            if (field === "members") {
              if (alias) field = alias;
              team[field] = await service.getTeamMembers(team.id, true);
            }
          }
        } else {
          team.members = await service.getTeamMembers(team.id);
        }
      }

      res.status(200).json(teams);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getTeam(req, res) {
    try {
      const { id } = req.params;
      const team = await service.getTeamById(id);
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
      const members = await service.getTeamMembers(team.id, true);
      team.members = members;
      res.status(200).json(team);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createTeam(req, res) {
    try {
      const { name, description, members } = req.body;
      const newTeam = await service.createTeam({ name, description });

      if (newTeam.id && members) {
        await service.joinTeam(newTeam.id, members);
        newTeam.members = members;
      }
      res.status(201).json(newTeam);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateTeam(req, res) {
    try {
      const { id } = req.params;
      if (!(await service.teamExists(id))) {
        return res
          .status(404)
          .json({ error: `The team ${id} does not exist.` });
      }
      const { name, description, members, deleteMembers } = req.body;
      const updated = await service.updateTeam(id, { name, description });

      if (deleteMembers) {
        await service.leaveTeam(updated.id, deleteMembers);
      }

      if (members) {
        await service.joinTeam(updated.id, members);
        updated.members = await service.getTeamMembers(updated.id);
      }
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteTeam(req, res) {
    try {
      const { id } = req.params;
      if (!(await service.teamExists(id))) {
        return res
          .status(404)
          .json({ error: `The team ${id} does not exist.` });
      }
      const result = await service.deleteTeam(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async joinTeam(req, res) {
    try {
      const { id } = req.params;
      if (!(await service.teamExists(id))) {
        return res
          .status(404)
          .json({ error: `The team ${id} does not exist.` });
      }
      let { members } = req.body;
      if (!Array.isArray(members)) members = [members];
      const result = await service.joinTeam(id, members);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async leaveTeam(req, res) {
    try {
      const { id } = req.params;
      if (!(await service.teamExists(id))) {
        return res
          .status(404)
          .json({ error: `The team ${id} does not exist.` });
      }
      let { members } = req.body;
      if (!Array.isArray(members)) members = [members];
      const result = await service.leaveTeam(id, members);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default teamController;
