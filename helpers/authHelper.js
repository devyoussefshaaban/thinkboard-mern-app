import jwt from "jsonwebtoken";

const gerenerateToken = (userId) =>
  jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });

export { gerenerateToken };
