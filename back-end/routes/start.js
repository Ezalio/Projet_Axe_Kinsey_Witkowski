import express from "express";
import UsersController from "../controllers/UsersController.js";
import AuthentificationController from "../controllers/AuthentificationController.js";
import { authenticateToken } from "../middlewares/Auth.js";

const router = express.Router();

router.get("/users", UsersController.index);
router.post("/users", UsersController.store);
router.get("/users/:id", UsersController.show);
router.post("/login", AuthentificationController.login);
router.post("/signup", AuthentificationController.signup);
router.get("/getMyProfile", authenticateToken, AuthentificationController.getMyProfile);
router.get("/openBooster", authenticateToken, AuthentificationController.openBooster);


export default router;

