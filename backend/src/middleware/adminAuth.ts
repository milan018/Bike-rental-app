import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["auth_token"];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;
    req.userId = decoded.userId;
    req.userRole = decoded.role; //get role from token.

    if (req.userRole !== "admin") {
      return res
        .status(403)
        .send({ message: "Forbidden: Admin access required" });
    }

    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized" });
  }
};

export default adminAuth;
