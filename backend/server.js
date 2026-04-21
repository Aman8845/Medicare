import express from "express";
import cors from "cors";
import "dotenv/config";

import { clerkMiddleware } from "@clerk/express";
import { connectDB } from "./config/db.js";
import doctorRouter from "./routes/doctorRoutes.js";
import serviceRouter from "./routes/serviceRouter.js";
import appointmentRouter from "./routes/appointmentRouter.js";
import serviceAppointmentRouter from "./routes/serviceAppointmentRouter.js";

/* important to add this */
import dns from "node:dns/promises";   
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const app = express();
const port = 4000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL?.replace(/\/$/, ''),
  process.env.ADMIN_URL?.replace(/\/$/, ''),
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      origin = origin.replace(/\/$/, ''); // remove trailing slash
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(clerkMiddleware());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

//DB
connectDB();

// Routes
app.use("/api/doctors", doctorRouter);
app.use("/api/services", serviceRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/service-appointments", serviceAppointmentRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// // Only call listen in local dev — Vercel handles this in production
// if (process.env.NODE_ENV !== "production") {
//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });
// }

// export default app;
