import prisma from "../config/prisma.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { generateAccessToken } from "../utils/jwt.js";

async function fetchAllCardIds() {
  try {
    const response = await fetch("https://hp-api.lainocs.fr/characters");
    const data = await response.json();
    return data.map((character) => ({
      id: character.id,
      name: character.name
    }));
  } catch (error) {
    console.error("Failed to fetch card IDs:", error);
    return [];
  }
}


function getRandomCards(cards, count) {
  return cards.sort(() => 0.5 - Math.random()).slice(0, count);
}

class AuthentificationController {
  async login(req, res) {
    try {
      console.log("[Server] Login attempt for email:", req.body.email);
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) return res.status(404).json({ message: "User not found" });

      const isSamePassword = await comparePassword(password, user.password);
      if (!isSamePassword) {
        console.log("[Server] Invalid password for email:", req.body.email);
        return res.status(401).json({ message: "Invalid password" });
      }
      console.log("[Server] Password valid, generating token...");
      const token = generateAccessToken(user.email);
      console.log("[Server] Token generated, sending response...");
      return res.status(200).json({ token });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  async signup(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already exists with the given email" });
      }

      const hashedPassword = await hashPassword(password);
      await prisma.user.create({
        data: { username, email, password: hashedPassword },
      });

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Error creating user" });
    }
  }

  async getMyProfile(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: req.user.data },
        include: {
          cards: {
            orderBy: {
              favorite: "desc",
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch profile", error: error.message });
    }
  }

  async toggleFavorite(req, res) {
    const { cardId, favorite } = req.body;
    const userId = req.user.id;

    try {
      const userCard = await prisma.userCard.updateMany({
        where: {
          userId,
          cardId,
        },
        data: {
          favorite,
        },
      });

      if (userCard.count === 0) {
        return res.status(404).json({ message: "Card not found" });
      }

      res.status(200).json({ message: "Favorite status updated successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update favorite status",
        error: error.message,
      });
    }
  }

  async openBooster(req, res) {
    const userEmail = req.user.data;  
    console.log("User Email:", userEmail);
  
    if (!userEmail) {
      return res.status(400).json({ message: "Email not found in request" });
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: { email: userEmail }
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const userId = user.id;
      console.log("User ID:", userId);
  
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      if (user.lastBoosterOpened && new Date(user.lastBoosterOpened) > twentyFourHoursAgo) {
        const nextAvailableTime = new Date(new Date(user.lastBoosterOpened).getTime() + 24 * 60 * 60 * 1000);
        return res.status(429).json({ message: "You can only open a booster once every 24 hours.", nextAvailable: nextAvailableTime.toISOString() });
      }
  
      const allCards = await fetchAllCardIds();
      if (allCards.length === 0) {
        return res.status(500).json({ message: "Failed to fetch cards from the API" });
      }
      const randomCards = getRandomCards(allCards, 5);
  
      for (const card of randomCards) {
        const existingCard = await prisma.userCard.findFirst({
          where: {
            userId: userId,
            cardId: card.id
          }
        });
  
        if (existingCard) {
          await prisma.userCard.update({
            where: { id: existingCard.id },
            data: { quantity: { increment: 1 } }
          });
        } else {
          await prisma.userCard.create({
            data: {
              userId: userId,
              cardId: card.id,
              name: card.name,
              quantity: 1
            }
          });
        }
      }
  
      await prisma.user.update({
        where: { id: userId },
        data: { lastBoosterOpened: now }
      });
  
      res.json({ cards: randomCards.map(card => card.name) });
    } catch (error) {
      console.error("Error in openBooster:", error);
      res.status(500).json({ message: "Failed to open booster", error: error.message });
    }
  }
  

}

export default new AuthentificationController();
