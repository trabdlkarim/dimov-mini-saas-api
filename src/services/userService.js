import bcrypt from "bcryptjs";
import config from "../config/index.js";

const userService = {
  async getUsers() {
    const { data, error } = await config.supabase
      .from("users")
      .select("id,name,email");
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

  async createUser(userData) {
    const { name, email, password } = userData;
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const { data, error } = await config.supabase
      .from("users")
      .insert([{ name, email, password: hashedPass }])
      .select("id,name,email,created_at");

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
      .select("id,name,email");

    if (error) throw new Error(error.message);

    return data;
  },

  async deleteUser(id) {
    const { error } = await config.supabase.from("users").delete().eq("id", id);

    if (error) throw new Error(error.message);

    return { success: true, message: "User successfully deleted." };
  },
};

export default userService;
