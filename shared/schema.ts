import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  deadline: timestamp("deadline").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  initialFiles: json("initial_files").$type<string[]>(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  submitterName: text("submitter_name").notNull(),
  submitterDepartment: text("submitter_department").notNull(),
  submitterContact: text("submitter_contact"),
  files: json("files").$type<string[]>().notNull().default([]),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'event_created', 'file_submitted', 'file_updated'
  description: text("description").notNull(),
  eventId: integer("event_id").references(() => events.id),
  submissionId: integer("submission_id").references(() => submissions.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEventSchema = createInsertSchema(events, {
  deadline: z.union([z.string(), z.date()]).transform((val) => 
    typeof val === 'string' ? new Date(val) : val
  ),
}).omit({
  id: true,
  createdAt: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  submittedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type EventWithStats = Event & {
  submissionCount: number;
  totalExpected?: number;
};

export type DashboardStats = {
  activeEvents: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  completionRate: string;
};
