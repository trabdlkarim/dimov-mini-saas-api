import config from "../config/index.js";
import { setHttpOnlyCookie, unsetHttpOnlyCookie } from "../utils/cookie.js";
import service from "../services/authService.js";
import userController from "./userController.js";

const authController = {
  async register(req, res) {
    userController.createUser(req, res);
  },

  async login(req, res) {
    if (req.cookies?.jwt) {
      const token = req.cookies.jwt;
      const user = await service.getUserFromToken(token);
      const message = "Already authenticated!";
      if (user) return res.status(200).json({ message, user, token });
    }

    const credentials = req.body;
    try {
      const data = await service.authenticate(credentials);

      if (data.error) {
        return res.status(401).json({ error: data.error });
      }

      const numOfDays = parseInt(config.jwt.expires.slice(0, -1));
      const milliSecsInOneDay = 1000 * 60 * 60 * 24;
      setHttpOnlyCookie(res, "jwt", data.token, milliSecsInOneDay * numOfDays);

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async logout(req, res) {
    unsetHttpOnlyCookie(res, "jwt");
    res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  },
};

export default authController;
