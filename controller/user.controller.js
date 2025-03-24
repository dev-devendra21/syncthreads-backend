import userModel from "../models/user.model.js";

const createUser = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({
      username: req.body.username,
    });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    if (req.body.password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const { username, password, location } = req.body;
    await userModel.create({ username, password, location });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { username, password, location } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    await userModel.updateOne({ _id: user._id }, { location });
    const token = user.generateToken();

    res.cookie("jwt_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expiresIn: "1d",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const userLogout = async (req, res) => {
  try {
    res.clearCookie("jwt_token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const defaultLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { location, username } = await userModel.findById(id);
    res.status(200).json({ location, username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createUser, getAllUsers, userLogin, userLogout, defaultLocation };
