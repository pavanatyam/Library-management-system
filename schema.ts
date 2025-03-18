import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  points: integer("points").notNull().default(0),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  addedBy: integer("added_by").notNull(),
});

export const pointsHistory = pgTable("points_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  points: integer("points").notNull(),
  reason: text("reason").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBookSchema = createInsertSchema(books).pick({
  title: true,
  author: true,
  description: true,
  price: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Book = typeof books.$inferSelect;
export type PointsHistory = typeof pointsHistory.$inferSelect;
export type Lead = typeof leads.$inferSelect;
