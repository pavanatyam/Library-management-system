import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertBookSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Books
  app.get("/api/books", async (_req, res) => {
    const books = await storage.getBooks();
    res.json(books);
  });

  app.post("/api/books", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const parsed = insertBookSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const book = await storage.createBook({
      ...parsed.data,
      addedBy: req.user.id,
    });

    // Award points for adding a book
    await storage.updateUserPoints(req.user.id, 50);
    await storage.addPointsHistory({
      userId: req.user.id,
      points: 50,
      reason: "Added new book",
      timestamp: new Date(),
    });

    await storage.addLead({
      userId: req.user.id,
      action: "Added book",
      timestamp: new Date(),
    });

    res.status(201).json(book);
  });

  // Points history
  app.get("/api/points-history", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const history = await storage.getPointsHistory(req.user.id);
    res.json(history);
  });

  // Leads (admin only endpoint)
  app.get("/api/leads", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const leads = await storage.getLeads();
    res.json(leads);
  });

  const httpServer = createServer(app);
  return httpServer;
}
