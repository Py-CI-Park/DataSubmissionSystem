import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertEventSchema, insertSubmissionSchema } from "@shared/schema";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req: any, file: any, cb: any) => {
    // Allow all file types
    cb(null, true);
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Admin password check
  app.post("/api/admin/auth", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "0000";
    
    if (password === adminPassword) {
      res.json({ success: true });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Events endpoints
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.post("/api/events", upload.array('initialFiles'), async (req, res) => {
    try {
      // Check password first
      const { password, ...eventData } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD || "0000";
      
      if (password !== adminPassword) {
        return res.status(401).json({ message: "잘못된 비밀번호입니다." });
      }
      
      // Convert string values to proper types for FormData requests
      const processedEventData = {
        ...eventData,
        isActive: eventData.isActive === 'true' || eventData.isActive === true,
      };
      
      const validatedData = insertEventSchema.parse(processedEventData);
      
      // Handle initial files if any
      const initialFiles: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          const filename = await storage.saveFile(file.originalname, file.buffer);
          initialFiles.push(filename);
        }
      }
      
      const event = await storage.createEvent({
        ...validatedData,
        initialFiles: initialFiles.length > 0 ? initialFiles : null,
      });
      
      res.status(201).json(event);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid event data", error: error.message });
    }
  });

  app.patch("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertEventSchema.partial().parse(req.body);
      
      if (updateData.deadline) {
        updateData.deadline = new Date(updateData.deadline);
      }
      
      const event = await storage.updateEvent(id, updateData);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data", error: error.message });
    }
  });

  // Submissions endpoints
  app.get("/api/submissions", async (req, res) => {
    try {
      const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;
      const submissions = await storage.getSubmissions(eventId);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  app.post("/api/submissions", upload.array('files', 10), async (req, res) => {
    try {
      const validatedData = insertSubmissionSchema.parse({
        ...req.body,
        eventId: parseInt(req.body.eventId),
      });
      
      // Handle uploaded files
      const files: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          const filename = await storage.saveFile(file.originalname, file.buffer);
          files.push(filename);
        }
      }
      
      const submission = await storage.createSubmission({
        ...validatedData,
        files,
      });
      
      res.status(201).json(submission);
    } catch (error) {
      res.status(400).json({ message: "Invalid submission data", error: error.message });
    }
  });

  // File download endpoint
  app.get("/api/files/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      const fileBuffer = await storage.getFile(filename);
      
      if (!fileBuffer) {
        return res.status(404).json({ message: "File not found" });
      }
      
      // Extract original filename from the unique filename
      const originalFilename = filename.substring(filename.indexOf('_') + 1);
      
      res.setHeader('Content-Disposition', `attachment; filename="${originalFilename}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(fileBuffer);
    } catch (error) {
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  // Activities endpoint
  app.get("/api/activities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
