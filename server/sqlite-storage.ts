import { eq, desc, sql, count } from "drizzle-orm";
import { db } from "./database";
import { events, submissions, activities, files } from "@shared/schema";
import type { Event, InsertEvent, Submission, InsertSubmission, Activity, InsertActivity, EventWithStats, DashboardStats } from "@shared/schema";
import { IStorage } from "./storage";

export class SqliteStorage implements IStorage {
  async getEvents(): Promise<EventWithStats[]> {
    try {
      const eventsData = await db.select().from(events).orderBy(desc(events.createdAt));
      
      const eventsWithStats: EventWithStats[] = [];
      
      for (const event of eventsData) {
        const submissionCountResult = await db
          .select({ count: count() })
          .from(submissions)
          .where(eq(submissions.eventId, event.id));
        
        const submissionCount = submissionCountResult[0]?.count || 0;
        
        // Parse JSON fields
        const parsedEvent: Event = {
          ...event,
          initialFiles: event.initialFiles ? JSON.parse(event.initialFiles) : null,
        };
        
        eventsWithStats.push({
          ...parsedEvent,
          submissionCount,
        });
      }
      
      return eventsWithStats;
    } catch (error) {
      console.error("Failed to get events:", error);
      throw error;
    }
  }

  async getEvent(id: number): Promise<Event | undefined> {
    try {
      const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
      if (!result[0]) return undefined;
      
      return {
        ...result[0],
        initialFiles: result[0].initialFiles ? JSON.parse(result[0].initialFiles) : null,
      };
    } catch (error) {
      console.error("Failed to get event:", error);
      throw error;
    }
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    try {
      const result = await db.insert(events).values({
        title: insertEvent.title,
        description: insertEvent.description,
        deadline: insertEvent.deadline,
        isActive: insertEvent.isActive ?? true,
        initialFiles: insertEvent.initialFiles ? JSON.stringify(insertEvent.initialFiles) : null,
        initialStoragePath: insertEvent.initialStoragePath || null,
        submissionStoragePath: insertEvent.submissionStoragePath || null,
      }).returning();
      
      const event = result[0];
      
      // Create activity
      await this.createActivity({
        type: 'event_created',
        description: `새 이벤트 "${event.title}"이 생성되었습니다.`,
        eventId: event.id,
      });
      
      return {
        ...event,
        initialFiles: event.initialFiles ? JSON.parse(event.initialFiles) : null,
      };
    } catch (error) {
      console.error("Failed to create event:", error);
      throw error;
    }
  }

  async updateEvent(id: number, updateEvent: Partial<InsertEvent>): Promise<Event | undefined> {
    try {
      const updateData: any = { ...updateEvent };
      if (updateData.initialFiles) {
        updateData.initialFiles = JSON.stringify(updateData.initialFiles);
      }
      
      const result = await db.update(events)
        .set(updateData)
        .where(eq(events.id, id))
        .returning();
      
      if (!result[0]) return undefined;
      
      return {
        ...result[0],
        initialFiles: result[0].initialFiles ? JSON.parse(result[0].initialFiles) : null,
      };
    } catch (error) {
      console.error("Failed to update event:", error);
      throw error;
    }
  }

  async getSubmissions(eventId?: number): Promise<Submission[]> {
    try {
      let submissionsData;
      
      if (eventId) {
        submissionsData = await db.select().from(submissions)
          .where(eq(submissions.eventId, eventId))
          .orderBy(desc(submissions.submittedAt));
      } else {
        submissionsData = await db.select().from(submissions)
          .orderBy(desc(submissions.submittedAt));
      }
      
      return submissionsData.map(sub => ({
        ...sub,
        files: sub.files ? JSON.parse(sub.files) : [],
      }));
    } catch (error) {
      console.error("Failed to get submissions:", error);
      throw error;
    }
  }

  async getSubmission(id: number): Promise<Submission | undefined> {
    try {
      const result = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
      if (!result[0]) return undefined;
      
      return {
        ...result[0],
        files: result[0].files ? JSON.parse(result[0].files) : [],
      };
    } catch (error) {
      console.error("Failed to get submission:", error);
      throw error;
    }
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    try {
      const result = await db.insert(submissions).values({
        eventId: insertSubmission.eventId,
        submitterName: insertSubmission.submitterName,
        submitterDepartment: insertSubmission.submitterDepartment,
        submitterContact: insertSubmission.submitterContact || null,
        files: insertSubmission.files ? JSON.stringify(insertSubmission.files) : "[]",
      }).returning();
      
      const submission = result[0];
      
      // Create activity
      const event = await this.getEvent(submission.eventId);
      await this.createActivity({
        type: 'file_submitted',
        description: `${submission.submitterName}님이 "${event?.title}"에 자료를 제출했습니다.`,
        eventId: submission.eventId,
        submissionId: submission.id,
      });
      
      return {
        ...submission,
        files: submission.files ? JSON.parse(submission.files) : [],
      };
    } catch (error) {
      console.error("Failed to create submission:", error);
      throw error;
    }
  }

  async getActivities(limit: number = 10): Promise<Activity[]> {
    try {
      return await db.select()
        .from(activities)
        .orderBy(desc(activities.createdAt))
        .limit(limit);
    } catch (error) {
      console.error("Failed to get activities:", error);
      throw error;
    }
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    try {
      const result = await db.insert(activities).values({
        type: insertActivity.type,
        description: insertActivity.description,
        eventId: insertActivity.eventId || null,
        submissionId: insertActivity.submissionId || null,
      }).returning();
      
      return result[0];
    } catch (error) {
      console.error("Failed to create activity:", error);
      throw error;
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Active events count
      const activeEventsResult = await db
        .select({ count: count() })
        .from(events)
        .where(eq(events.isActive, true));
      
      const activeEventsCount = activeEventsResult[0]?.count || 0;
      
      // Total submissions count
      const totalSubmissionsResult = await db
        .select({ count: count() })
        .from(submissions);
      
      const totalSubmissions = totalSubmissionsResult[0]?.count || 0;
      
      // Get active event IDs
      const activeEventsData = await db
        .select({ id: events.id })
        .from(events)
        .where(eq(events.isActive, true));
      
      const activeEventIds = activeEventsData.map(e => e.id);
      
      // Submissions for active events
      let submissionsForActiveEvents = 0;
      if (activeEventIds.length > 0) {
        const submissionsResult = await db
          .select({ count: count() })
          .from(submissions)
          .where(sql`${submissions.eventId} IN (${sql.join(activeEventIds.map(id => sql`${id}`), sql`, `)})`);
        
        submissionsForActiveEvents = submissionsResult[0]?.count || 0;
      }
      
      // Calculate completion rate (assume 15 expected submissions per active event)
      const expectedSubmissions = activeEventsCount * 15;
      const completionRate = expectedSubmissions > 0 
        ? Math.round((submissionsForActiveEvents / expectedSubmissions) * 100)
        : 0;
      
      const pendingSubmissions = Math.max(0, expectedSubmissions - submissionsForActiveEvents);
      
      return {
        activeEvents: activeEventsCount,
        totalSubmissions,
        pendingSubmissions,
        completionRate: `${completionRate}%`,
      };
    } catch (error) {
      console.error("Failed to get dashboard stats:", error);
      throw error;
    }
  }

  async saveFile(filename: string, buffer: Buffer): Promise<string> {
    try {
      const uniqueFilename = `${Date.now()}_${filename}`;
      
      await db.insert(files).values({
        filename: uniqueFilename,
        originalName: filename,
        mimeType: null,
        size: buffer.length,
        data: buffer,
      });
      
      return uniqueFilename;
    } catch (error) {
      console.error("Failed to save file:", error);
      throw error;
    }
  }

  async getFile(filename: string): Promise<Buffer | undefined> {
    try {
      const result = await db
        .select({ data: files.data })
        .from(files)
        .where(eq(files.filename, filename))
        .limit(1);
      
      return result[0]?.data as Buffer;
    } catch (error) {
      console.error("Failed to get file:", error);
      throw error;
    }
  }
} 