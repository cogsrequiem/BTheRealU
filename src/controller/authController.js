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

    //Create User
    const user = await prisma.user.create({
      data: {
        name,
        lastname,
        username,
        email,
        password: hashedPassword,
      },
    });

    // Generate JSONWebToken
    const token = generateToken(user.id, res);

    res.status(201).json({
      status: "succes",
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
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
  const { email, password } = req.body;

  // Verify if the user username or email exist in the table

  const existingEmail = await prisma.user.findUnique({
    where: { email: email },
  });

  // const existingEmail = await prisma.user.findUnique({
  //   where: { email: email },
  // });

  if (!existingEmail) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(
    password,
    existingEmail.password,
  );

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate JSONWebToken
  const token = generateToken(existingEmail.id, res);

  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: existingEmail.id,
        email: email,
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
