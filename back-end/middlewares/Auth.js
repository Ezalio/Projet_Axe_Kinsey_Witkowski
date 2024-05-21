import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const tokenSecret = process.env.TOKEN_SECRET;

export function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.log("No token provided.");
        return res.status(401).send("Access Denied: No Token Provided!");
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log("Token verification failed:", err);
            return res.status(401).send("Invalid Token");
        }
        req.user = decoded;  
        next();
    });
}


export async function login(req, res) {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ data: email }, tokenSecret, { expiresIn: "3h" });
    res.status(200).json({ token });
}

export async function signup(req, res) {
    const { username, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
        },
    });
    res.status(201).json({ message: "User created successfully" });
}



