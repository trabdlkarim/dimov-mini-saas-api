import config from "../config/index.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const payload = { id: userId };
  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expires,
  });

  return token;
};

export default generateToken;
