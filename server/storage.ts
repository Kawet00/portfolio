import { 
  type User, type InsertUser, 
  type Project, type InsertProject,
  type Profile, type InsertProfile
} from "../shared/schema.js";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getProject(id: number): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Profile methods
  getProfile(): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private profiles: Map<number, Profile>;
  private userCurrentId: number;
  private projectCurrentId: number;
  private profileCurrentId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.profiles = new Map();
    this.userCurrentId = 1;
    this.projectCurrentId = 1;
    this.profileCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Project methods
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectCurrentId++;
    // Create a new object with required properties to ensure type safety
    const project: Project = {
      id,
      title: insertProject.title,
      description: insertProject.description,
      category: insertProject.category,
      image: insertProject.image,
      technologies: insertProject.technologies,
      liveUrl: insertProject.liveUrl ?? null,
      codeUrl: insertProject.codeUrl ?? null
    };
    this.projects.set(id, project);
    return project;
  }
  
  // Profile methods
  async getProfile(): Promise<Profile | undefined> {
    // Since we only have one profile, just return the first one if it exists
    const profiles = Array.from(this.profiles.values());
    return profiles.length > 0 ? profiles[0] : undefined;
  }
  
  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = this.profileCurrentId++;
    // Create a new object with required properties to ensure type safety
    const profile: Profile = {
      id,
      name: insertProfile.name,
      intro: insertProfile.intro,
      location: insertProfile.location,
      experience: insertProfile.experience,
      education: insertProfile.education,
      availability: insertProfile.availability,
      bio: insertProfile.bio,
      bio2: insertProfile.bio2,
      github: insertProfile.github ?? null,
      discord: insertProfile.discord ?? null,
      codepen: insertProfile.codepen ?? null
    };
    this.profiles.set(id, profile);
    return profile;
  }
}

export const storage = new MemStorage();
