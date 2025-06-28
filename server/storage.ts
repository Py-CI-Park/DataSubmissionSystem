import { events, submissions, activities, type Event, type InsertEvent, type Submission, type InsertSubmission, type Activity, type InsertActivity, type EventWithStats, type DashboardStats } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private events: Map<number, Event>;
  private submissions: Map<number, Submission>;
  private activities: Map<number, Activity>;
  private files: Map<string, Buffer>;
  private currentEventId: number;
  private currentSubmissionId: number;
  private currentActivityId: number;

  constructor() {
    this.events = new Map();
    this.submissions = new Map();
    this.activities = new Map();
    this.files = new Map();
    this.currentEventId = 1;
    this.currentSubmissionId = 1;
    this.currentActivityId = 1;
  }

  async getEvents(): Promise<EventWithStats[]> {
    const eventsArray = Array.from(this.events.values());
    return eventsArray.map(event => {
      const submissionCount = Array.from(this.submissions.values())
        .filter(sub => sub.eventId === event.id).length;
      return {
        ...event,
        submissionCount
      };
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    const event: Event = {
      id,
      title: insertEvent.title,
      description: insertEvent.description,
      deadline: insertEvent.deadline,
      isActive: insertEvent.isActive !== undefined ? insertEvent.isActive : true,
      createdAt: new Date(),
      initialFiles: insertEvent.initialFiles ? [...insertEvent.initialFiles] : null,
    };
    this.events.set(id, event);
    
    // Create activity
    await this.createActivity({
      type: 'event_created',
      description: `새 이벤트 "${event.title}"이 생성되었습니다.`,
      eventId: id,
    });
    
    return event;
  }

  async updateEvent(id: number, updateEvent: Partial<InsertEvent>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent: Event = {
      ...event,
      ...updateEvent,
      initialFiles: updateEvent.initialFiles ? 
        [...updateEvent.initialFiles] : 
        event.initialFiles,
    };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async getSubmissions(eventId?: number): Promise<Submission[]> {
    let submissions = Array.from(this.submissions.values());
    if (eventId) {
      submissions = submissions.filter(sub => sub.eventId === eventId);
    }
    return submissions.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
  }

  async getSubmission(id: number): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = this.currentSubmissionId++;
    const submission: Submission = {
      id,
      eventId: insertSubmission.eventId,
      submitterName: insertSubmission.submitterName,
      submitterDepartment: insertSubmission.submitterDepartment,
      submitterContact: insertSubmission.submitterContact || null,
      files: insertSubmission.files ? insertSubmission.files as string[] : [],
      submittedAt: new Date(),
    };
    this.submissions.set(id, submission);
    
    // Create activity
    const event = await this.getEvent(submission.eventId);
    await this.createActivity({
      type: 'file_submitted',
      description: `${submission.submitterName}님이 "${event?.title}"에 자료를 제출했습니다.`,
      eventId: submission.eventId,
      submissionId: id,
    });
    
    return submission;
  }

  async getActivities(limit: number = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const activity: Activity = {
      id,
      type: insertActivity.type,
      description: insertActivity.description,
      eventId: insertActivity.eventId || null,
      submissionId: insertActivity.submissionId || null,
      createdAt: new Date(),
    };
    this.activities.set(id, activity);
    return activity;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const activeEvents = Array.from(this.events.values()).filter(e => e.isActive).length;
    const totalSubmissions = this.submissions.size;
    
    // Calculate completion rate based on active events
    const activeEventIds = Array.from(this.events.values())
      .filter(e => e.isActive)
      .map(e => e.id);
    
    const submissionsForActiveEvents = Array.from(this.submissions.values())
      .filter(sub => activeEventIds.includes(sub.eventId)).length;
    
    // Assume average of 15 expected submissions per active event
    const expectedSubmissions = activeEvents * 15;
    const completionRate = expectedSubmissions > 0 
      ? Math.round((submissionsForActiveEvents / expectedSubmissions) * 100)
      : 0;
    
    const pendingSubmissions = Math.max(0, expectedSubmissions - submissionsForActiveEvents);
    
    return {
      activeEvents,
      totalSubmissions,
      pendingSubmissions,
      completionRate: `${completionRate}%`,
    };
  }

  async saveFile(filename: string, buffer: Buffer): Promise<string> {
    const uniqueFilename = `${Date.now()}_${filename}`;
    this.files.set(uniqueFilename, buffer);
    return uniqueFilename;
  }

  async getFile(filename: string): Promise<Buffer | undefined> {
    return this.files.get(filename);
  }
}

export const storage = new MemStorage();
