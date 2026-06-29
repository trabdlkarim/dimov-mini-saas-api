import config from "../config/index.js";
import userService from "./userService.js";

const teamTable = "teams";
const memberTable = "team_members";

const teamService = {
  async getTeams() {
    const { data, error } = await config.supabase.from(teamTable).select();
    if (error) throw new Error(error.message);
    return data;
  },

  async getTeamMembers(teamId, expand = false) {
    let { data: members, error } = await config.supabase
      .from(memberTable)
      .select("user_id")
      .eq("team_id", teamId);
    if (error) throw new Error(error.message);
    members = members.map((member) => member.user_id);
    if (expand) {
      members = await userService.getUsers(members);
    }
    return members;
  },

  async getTeamById(id) {
    const { data, error } = await config.supabase
      .from(teamTable)
      .select()
      .eq("id", id);

    if (error) throw new Error(error.message);

    return data[0];
  },

  async createTeam(teamData) {
    const { name, description } = teamData;
    if (!name) throw new Error("The name field is required.");
    const { data: newTeam, error } = await config.supabase
      .from(teamTable)
      .insert({ name, description })
      .select()
      .limit(1)
      .single();

    if (error) throw new Error(error.message);

    return newTeam;
  },

  async updateTeam(id, teamData) {
    const { data, error } = await config.supabase
      .from(teamTable)
      .update(teamData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  async deleteTeam(id) {
    const { error } = await config.supabase
      .from(teamTable)
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    return { success: true, message: "The team successfully deleted." };
  },

  async teamExists(teamId) {
    const { data: team, error } = await config.supabase
      .from(teamTable)
      .select()
      .eq("id", teamId)
      .single();
    if (error) return false;
    else return team;
  },

  async isMember(teamId, userId) {
    const { error } = await config.supabase
      .from(memberTable)
      .select()
      .eq("team_id", teamId)
      .eq("user_id", userId)
      .limit(1)
      .single();
    if (error) return false;
    else return true;
  },

  async joinTeam(teamId, members) {
    if (!Array.isArray(members)) {
      throw new Error("The members field must be an array of int.");
    }

    const membership = [];
    for (const member of members) {
      if (!(await this.isMember(teamId, member)))
        membership.push({ team_id: teamId, user_id: member });
    }
    const { data, error } = await config.supabase
      .from(memberTable)
      .insert(membership)
      .select();

    if (error) throw new Error(error.message);
    return {
      success: true,
      message: "The members joined successfully the team.",
      membership,
    };
  },

  async leaveTeam(teamId, members) {
    if (!Array.isArray(members)) {
      throw new Error("The members field must be an array of int.");
    }
    const { error } = await config.supabase
      .from(memberTable)
      .delete()
      .eq("team_id", teamId)
      .in("user_id", members);
    return {
      success: true,
      message: "The members successfully left the team.",
    };
  },
};

export default teamService;
