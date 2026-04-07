import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";

// Logic to add a new user
const registerUser = async (req, res) => {
  try {
    const { name, lastname, username, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    const existingUsername = await prisma.user.findUnique({
      where: { username: username },
    });

    if (existingUser || existingUsername) {
      return res
        .status(400)
        .json({ message: "Email or user name already used" });
    }

    const user = await prisma.user.create({
      data: {
        name,
        lastname,
        username,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({
      status: "succes",
      data: {
        user: {
          id: user.id,
          username: username,
          email: email,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Registration failed",
    });
  }
};

export default registerUser;
