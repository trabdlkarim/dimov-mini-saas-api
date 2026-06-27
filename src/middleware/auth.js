import jwt from "jsonwebtoken";
import config from "../config/index.js";
import userService from "../services/userService.js";

const auth = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  } 
  
  if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized - request missing auth token." });
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret);
    const user = userService.getUserById(payload.id);
    if (!user) {
      return res.status(401).json({ error: "User no longer exists." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token provided." });
  }
};

export default auth;
