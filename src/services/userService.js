import bcrypt from "bcryptjs";
import config from "../config/index.js";

const userService = {
  async getUsers(ids = []) {
    let query = config.supabase.from("users").select("id,name,email");
    if (ids) query = query.in("id", ids);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  },

  async getUserById(id) {
    const result = await config.supabase
      .from("users")
      .select("id,name,email")
      .eq("id", id);

    if (result.error) throw new Error(result.error.message);

    return result.data[0];
  },

  // Allow adding multiple users at once
  async createUser(userData) {
    let single = false;

    if (!Array.isArray(userData)) {
      userData = [userData];
      single = true;
    }

    for (const user of userData) {
      const { name, email, password } = user;
      if (!email) throw new Error("The email field is required.");
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        user.password = hashedPass;
      }
    }

    let query = config.supabase
      .from("users")
      .insert(userData)
      .select("id,name,email,created_at");

    if (single) {
      query = query.limit(1).single();
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return data;
  },

  async updateUser(id, userData) {
    const { name, email, password } = userData;
    let updates = { name, email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);
      updates.password = hashedPass;
    }

    const { data, error } = await config.supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select("id,name,email").single();

    if (error) throw new Error(error.message);

    return data;
  },

  async deleteUser(id) {
    const { error } = await config.supabase.from("users").delete().eq("id", id);

    if (error) throw new Error(error.message);

    return { success: true, message: "User successfully deleted." };
  },
  async userExists(userId) {
    const { data: user, error } = await config.supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();
    if (error) return false;
    else return user;
  },
};

export default userService;
