import ip from "ip";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, login, signup } from "./middlewares/Auth.js";
import path from "path";
import { fileURLToPath } from "url";
import AuthentificationController from "./controllers/AuthentificationController.js";

let lastHouseVisited = "Gryffindor";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const prisma = new PrismaClient();
const port = 3000;
const ipAdr = ip.address();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../front-end")));

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ message: lastHouseVisited });
});

app.post("/login", login);
app.post("/signup", signup);
app.get("/getMyProfile", authenticateToken, (req, res) => {
  AuthentificationController.getMyProfile(req, res);
});
app.post("/toggleFavorite", authenticateToken, (req, res) => {
  AuthentificationController.toggleFavorite(req, res);
});
app.post(
  "/openBooster",
  authenticateToken,
  AuthentificationController.openBooster
);

app.post("/updateLed", (req, res) => {
  const { house } = req.body;
  console.log("House received for LED:", house);
  lastHouseVisited = house;
  res.json({ success: true, message: `LED color updated to ${house}` });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../front-end", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on http://${ipAdr}:${port}`);
});
