import config from "../config/index.js";

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
    if(!Array.isArray(projectData)) projectData = [projectData];
    const { data, error } = await config.supabase
      .from(table)
      .insert(projectData)
      .select();

    if (error) throw new Error(error.message);

    return data;
  },

  async updateProject(id, projectData) {
    const { data, error } = await config.supabase
      .from(table)
      .update(projectData)
      .eq("id", id)
      .select();

    if (error) throw new Error(error.message);

    return data;
  },

  async deleteProject(id) {
    const { error } = await config.supabase.from(table).delete().eq("id", id);

    if (error) throw new Error(error.message);

    return { success: true, message: "Project successfully deleted." };
  },

  // Search projects by name
  async searchProjects(query) {
    if (!query) throw new Error("The 'query' query param is riquired.");
    const { data, error } = await supabase
      .from(table)
      .select()
      .ilike("name", `%${query}%`);
    if (error) throw new Error(error.message);
    return data;
  },

  // ?filter=status:active,deadline:2026-03-25
  async filterProjects(filter) {
     if (!filter) throw new Error("The 'filter' query param is riquired. Ex: ?filter=status:active,deadline:2026-03-25");
    let query = supabase.from(table).select();
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
};

export default projectService;