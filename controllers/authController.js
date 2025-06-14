import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import * as yup from "yup";
import { registerSchema, loginSchema } from "../validations/authValidation.js";
import { gerenerateToken } from "../helpers/authHelper.js";

export const registerUser = async (req, res) => {
  try {
    await registerSchema.validate(req.body, { abortEarly: false });

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10)
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = gerenerateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new Error("Validation error: " + error.errors.join(", "));
    }
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    await loginSchema.validate(req.body, { abortEarly: false });

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const token = gerenerateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new Error("Validation error: " + error.errors.join(", "));
    }
    res.status(400).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const { user } = req;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
