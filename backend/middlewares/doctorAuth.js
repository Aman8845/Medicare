import jwt from "jsonwebtoken";
import Doctor from "../models/Doctor.js";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function doctorAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    //verify token
    const payload = jwt.verify(token, JWT_SECRET);

    if (payload.role && payload.role !== "doctor") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access denied: Only doctors are allowed",
        });
    }

    //fetch doctor
    const doctor = await Doctor.findById(payload.id).select("-password");

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    //Attach doctor to request
    req.doctor = doctor;
    next();
  } catch (error) {
    console.error("Doctor JWT verification failed:", error);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
}
