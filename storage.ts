import { User, InsertUser, Book, PointsHistory, Lead } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<User>;
  
  getBooks(): Promise<Book[]>;
  getBook(id: number): Promise<Book | undefined>;
  createBook(book: Omit<Book, "id">): Promise<Book>;
  
  getPointsHistory(userId: number): Promise<PointsHistory[]>;
  addPointsHistory(history: Omit<PointsHistory, "id">): Promise<PointsHistory>;
  
  getLeads(): Promise<Lead[]>;
  addLead(lead: Omit<Lead, "id">): Promise<Lead>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private books: Map<number, Book>;
  private pointsHistory: Map<number, PointsHistory>;
  private leads: Map<number, Lead>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.pointsHistory = new Map();
    this.leads = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, points: 100 }; // 100 points for registration
    this.users.set(id, user);
    
    await this.addPointsHistory({
      userId: user.id,
      points: 100,
      reason: "New registration bonus",
      timestamp: new Date(),
    });
    
    await this.addLead({
      userId: user.id,
      action: "Registered",
      timestamp: new Date(),
    });
    
    return user;
  }

  async updateUserPoints(userId: number, points: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    user.points += points;
    this.users.set(userId, user);
    return user;
  }

  async getBooks(): Promise<Book[]> {
    return Array.from(this.books.values());
  }

  async getBook(id: number): Promise<Book | undefined> {
    return this.books.get(id);
  }

  async createBook(book: Omit<Book, "id">): Promise<Book> {
    const id = this.currentId++;
    const newBook: Book = { ...book, id };
    this.books.set(id, newBook);
    return newBook;
  }

  async getPointsHistory(userId: number): Promise<PointsHistory[]> {
    return Array.from(this.pointsHistory.values())
      .filter(history => history.userId === userId);
  }

  async addPointsHistory(history: Omit<PointsHistory, "id">): Promise<PointsHistory> {
    const id = this.currentId++;
    const newHistory: PointsHistory = { ...history, id };
    this.pointsHistory.set(id, newHistory);
    return newHistory;
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async addLead(lead: Omit<Lead, "id">): Promise<Lead> {
    const id = this.currentId++;
    const newLead: Lead = { ...lead, id };
    this.leads.set(id, newLead);
    return newLead;
  }
}

export const storage = new MemStorage();
