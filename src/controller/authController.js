import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { generateToken } from "../utils/generateToken.js";

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
      return res.status(400).json({ error: "Email or user name already used" });
    }

    // Generate JSONWebToken
    const token = generateToken(existingUsername.id, res);

    //Create User
    const user = await prisma.user.create({
      data: {
        user: {
          name,
          lastname,
          username,
          email,
          password: hashedPassword,
        },
        token,
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

const login = async (req, res) => {
  const { username, password } = req.body;

  // Verify if the user username or email exist in the table

  const existingUsername = await prisma.user.findUnique({
    where: { username: username },
  });

  // const existingEmail = await prisma.user.findUnique({
  //   where: { email: email },
  // });

  if (!existingUsername) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(
    password,
    existingUsername.password,
  );

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate JSONWebToken
  const token = generateToken(existingUsername.id, res);

  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: existingUsername.id,
        username: username,
      },
      token,
    },
  });
};

const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export { registerUser, login, logout };
