import { sqliteTable, text, integer, real, blob } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  deadline: integer("deadline", { mode: "timestamp" }).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  initialFiles: text("initial_files"),
  initialStoragePath: text("initial_storage_path"),
  submissionStoragePath: text("submission_storage_path"),
});

export const submissions = sqliteTable("submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventId: integer("event_id").notNull().references(() => events.id),
  submitterName: text("submitter_name").notNull(),
  submitterDepartment: text("submitter_department").notNull(),
  submitterContact: text("submitter_contact"),
  files: text("files").notNull().default("[]"),
  submittedAt: integer("submitted_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const activities = sqliteTable("activities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(), // 'event_created', 'file_submitted', 'file_updated'
  description: text("description").notNull(),
  eventId: integer("event_id").references(() => events.id),
  submissionId: integer("submission_id").references(() => submissions.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// 파일 저장을 위한 새로운 테이블 추가
export const files = sqliteTable("files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  filename: text("filename").notNull().unique(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type"),
  size: integer("size").notNull(),
  data: blob("data").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
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

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
});

export type Event = typeof events.$inferSelect & {
  initialFiles?: string[] | null;
};
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Submission = typeof submissions.$inferSelect & {
  files: string[];
};
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;

export type EventWithStats = Event & {
  submissionCount: number;
  totalExpected?: number;
  initialStoragePath?: string | null;
  submissionStoragePath?: string | null;
};

export type DashboardStats = {
  activeEvents: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  completionRate: string;
};
