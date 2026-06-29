import config from "../config/index.js";
import userService from "./userService.js";

const table = "projects";

const projectService = {
  async getProjects() {
    const { data, error } = await config.supabase.from(table).select();
    if (error) throw new Error(error.message);
    return data;
  },

  async getProjectById(id) {
    const { data, error } = await config.supabase
      .from(table)
      .select()
      .eq("id", id);
    if (error) throw new Error(error.message);
    return data[0];
  },

  async createProject(projectData) {
    let single = false;

    if (!Array.isArray(projectData)) {
      projectData = [projectData];
      single = true;
    }

    for (const project of projectData) {
      const { status, deadline, budget, team_member } = project;
      if (!(status && deadline && budget && team_member)) {
        throw new Error(
          "Missing required field. The required fields are: status,deadline,budget,team_member",
        );
      }
    }

    let query = config.supabase.from(table).insert(projectData).select();

    if (single) {
      query = query.limit(1).single();
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return data;
  },

  async updateProject(id, projectData) {
    const { data, error } = await config.supabase
      .from(table)
      .update(projectData)
      .eq("id", id)
      .select().single();

    if (error) throw new Error(error.message);

    return data;
  },

  async deleteProject(id) {
    const { error } = await config.supabase.from(table).delete().eq("id", id);

    if (error) throw new Error(error.message);

    return { success: true, message: "Project successfully deleted." };
  },

  // Search projects by name
  async searchProjects(search) {
    if (!search) throw new Error("The 'search' param is riquired.");
    search = search.trim();
    const { data, error } = await config.supabase
      .from(table)
      .select()
      .or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    if (error) throw new Error(error.message);
    return data;
  },

  // ?filter=status:active,deadline:2026-03-25
  async filterProjects(filter) {
    if (!filter) throw new Error("The 'filter' param is riquired.");
    let query = config.supabase.from(table).select();
    filter = filter.trim();
    const params = filter.split(",");
    for (const param of params) {
      let [column, value] = param.split(":");
      if (!value) {
        query = query.eq("status", column);
      } else {
        query = query.eq(column, value);
      }
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  },

  async expandRelations(projects, expand) {
    const relations = expand.split(",");
    for (const relation of relations) {
      let [foreignKey, alias] = relation.split(":");
      if (foreignKey === "team_member") {
        for (const project of projects) {
          const teamMember = await userService.getUserById(project.team_member);
          if (teamMember) {
            let field = alias ? alias : "team_member";
            project[field] = teamMember;
          }
        }
      }
      return projects;
    }
  },
  async projectExists(projectId) {
    const { data: project, error } = await config.supabase
      .from(table)
      .select()
      .eq("id", projectId)
      .single();
    if (error) return false;
    else return project;
  },
};

export default projectService;
