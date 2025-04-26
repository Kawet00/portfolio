import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // web, mobile, other
  image: text("image").notNull(),
  liveUrl: text("live_url"),
  codeUrl: text("code_url"),
  technologies: text("technologies").array().notNull(),
});

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  intro: text("intro").notNull(),
  location: text("location").notNull(),
  experience: text("experience").notNull(),
  education: text("education").notNull(),
  availability: text("availability").notNull(),
  bio: text("bio").notNull(),
  bio2: text("bio2").notNull(),
  github: text("github"),
  discord: text("discord"),
  codepen: text("codepen"),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  description: true,
  category: true,
  image: true,
  liveUrl: true,
  codeUrl: true,
  technologies: true,
});

export const insertProfileSchema = createInsertSchema(profile).pick({
  name: true,
  intro: true,
  location: true,
  experience: true,
  education: true,
  availability: true,
  bio: true,
  bio2: true,
  github: true,
  discord: true,
  codepen: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profile.$inferSelect;
