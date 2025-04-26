import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertProjectSchema } from "@shared/schema";
import { ZodError } from "zod";
import { sendContactNotification } from "./discord";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize with sample data
  initializeData();

  // API routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const project = await storage.getProject(id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.get("/api/profile", async (req, res) => {
    try {
      const profile = await storage.getProfile();

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      await sendContactNotification({ name, email, subject, message });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to process contact form" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function initializeData() {
  // Check if profile exists, if not create sample data
  const profile = await storage.getProfile();
  if (!profile) {
    try {
      const profileData = insertProfileSchema.parse({
        name: "Kawet",
        intro:
          "I'm a passionate full-stack developer with expertise in modern web technologies and a love for creating intuitive, performant applications.",
        location: "FRANCE",
        experience: "5+ years",
        education: "Currently studying for a BTS SIO, soon to be an engineer!",
        availability: "Freelance & Student",
        bio: "I specialize in building modern web applications using React, Node.js, and Lua scripts. My approach combines technical expertise with a keen eye for user experience and performance optimization.",
        bio2: "When I'm not coding, you'll find me playing sports or video games. I'm always exploring new technologies and approaches to problem-solving.",
        github: "https://github.com/Kawet00",
        discord: "https://discord.com/users/691644619758370846",
        codepen: "https://codepen.io/Kawet",
      });
      await storage.createProfile(profileData);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Invalid profile data:", error.errors);
      } else {
        console.error("Failed to create profile:", error);
      }
    }
  }

  // Check if projects exist, if not create sample data
  const projects = await storage.getAllProjects();
  if (projects.length === 0) {
    const projectsData = [
      {
        title: "Discord Bot",
        description: "It was a simple free open-sourced discord bot.",
        category: "Web",
        image:
          "https://cdn.glitch.global/9c9dca97-de49-4d59-877f-1880b62d8a44/UT_Bot-Logo_1.2.png?v=1647689722683",
        liveUrl: "https://utlbot.glitch.me",
        codeUrl: "https://github.com/Kawet00/UtilityBot",
        technologies: ["Node.js", "MongoDB"],
      },
    ];

    for (const projectData of projectsData) {
      try {
        const validatedData = insertProjectSchema.parse(projectData);
        await storage.createProject(validatedData);
      } catch (error) {
        if (error instanceof ZodError) {
          console.error("Invalid project data:", error.errors);
        } else {
          console.error("Failed to create project:", error);
        }
      }
    }
  }
}
