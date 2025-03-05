import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  address: text("address"),
});

export const protocols = pgTable("protocols", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // DeFi, NFT, Infrastructure
  description: text("description").notNull(),
  tvl: integer("tvl"),
  metadata: jsonb("metadata").$type<{
    website?: string;
    docs?: string;
    twitter?: string;
    github?: string;
  }>(),
});

export const userProtocolInteractions = pgTable("user_protocol_interactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  protocolId: integer("protocol_id").references(() => protocols.id),
  interactionCount: integer("interaction_count").notNull().default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  address: true,
});

export const insertProtocolSchema = createInsertSchema(protocols);

export const insertInteractionSchema = createInsertSchema(userProtocolInteractions);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Protocol = typeof protocols.$inferSelect;
export type UserProtocolInteraction = typeof userProtocolInteractions.$inferSelect;
