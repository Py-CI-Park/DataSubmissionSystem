import { events, submissions, activities, type Event, type InsertEvent, type Submission, type InsertSubmission, type Activity, type InsertActivity, type EventWithStats, type DashboardStats } from "@shared/schema";
import { SqliteStorage } from "./sqlite-storage";

export interface IStorage {
  // Events
  getEvents(): Promise<EventWithStats[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  
  // Submissions
  getSubmissions(eventId?: number): Promise<Submission[]>;
  getSubmission(id: number): Promise<Submission | undefined>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  
  // Activities
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Dashboard
  getDashboardStats(): Promise<DashboardStats>;
  
  // Files
  saveFile(filename: string, buffer: Buffer): Promise<string>;
  getFile(filename: string): Promise<Buffer | undefined>;
}

export const storage = new SqliteStorage();
