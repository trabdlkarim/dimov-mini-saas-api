import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config/index.js";
import generateToken from "../utils/token.js";
import userService from "./userService.js";

const authService = {
  async authenticate(credentials) {
    const { email, password } = credentials;
    const { data, error } = await config.supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (error) throw new Error(error.message);

    const user = data[0];
    const errMessage = "Invalid email or password";
    if (!user) {
      return { error: errMessage };
    }

    // Verify user password
    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
      return { error: errMessage };
    }

    // Generate JWT token
    const token = generateToken(user.id);

    delete user.password;

    return { user, token };
  },
  
  async getUserFromToken(token) {
    try {
      const payload = jwt.verify(token, config.jwt.secret);
      const user = await userService.getUserById(payload.id);
      return user;
    } catch (error) {}
  },
};

export default authService;
