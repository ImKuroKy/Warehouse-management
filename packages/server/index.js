import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import verifyRoutes from "./routes/verifyRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import organizationUsersRoutes from "./routes/organizationUsersRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 4040;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/organizations", organizationUsersRoutes);
app.use("/api/verify", verifyRoutes);

// ИСПРАВИТЬ КОНТРОЛЛЕРЫ И РОУТЫ В СООТВЕТСТВИИ С НОВЫМИ ИДЕЯМИ
// app.use("/profile", profileRoutes);

// ИСПРАВИТЬ КОНТРОЛЛЕРЫ И РОУТЫ В СООТВЕТСТВИИ С НОВЫМИ ИДЕЯМИ
// app.use("/warehouse", warehouseRoutes);

app.listen(port, (err) => {
  if (err) {
    return console.log("Something went wrong: ", err);
  }
  console.log("Server is running...");
  console.log(`Port --> ${port} \n`);
});

