import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  const payload = { userId: userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });

  console.log('SECRET génération:', process.env.JWT_SECRET);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
  return token;
};

export { generateToken };
