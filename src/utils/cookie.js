import config from "../config/index.js";

export const setHttpOnlyCookie = (res, name, value, maxAge) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "lax",
    maxAge: maxAge,
  });
};

export const unsetHttpOnlyCookie = (res, name) => {
    res.cookie(name, "", {
        httpOnly: true,
        expires: new Date(0),
    });
}
