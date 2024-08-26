import jwt from "jsonwebtoken";
import User from "../models/User.js";
export default async function (req, res, next) {
  if (!req.cookies.token) {
    next();
    return;
  }

  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.JWT_SECRET || "Env missing");
  const user = await User.findById(decode.userId);
  req.userId = user._id;
  req.role = user.role;
  res.locals.role = user.role;
  next();
}
