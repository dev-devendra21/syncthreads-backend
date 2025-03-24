import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const token =
      req.cookies.jwt_token || req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "User not logged in" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decodedToken._id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not logged in" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default authUser;
