import { createServer } from "http";
import { insertContactSchema, insertProgramSchema, insertStudentSchema, insertNewsSchema, insertEventSchema, insertRecruitmentSchema } from "../shared/schema.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import 'dotenv/config';
// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
// Auth middleware
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.adminUser = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};
// Helper function to upload image to Cloudinary
const uploadImageToCloudinary = async (file, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            resource_type: "image",
            folder: folder,
            transformation: [
                { width: 800, height: 600, crop: "limit" },
                { quality: "auto" },
                { format: "webp" }
            ]
        }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve((result === null || result === void 0 ? void 0 : result.secure_url) || "");
        });
        uploadStream.end(file.buffer);
    });
};
export async function registerRoutes(app, storage) {
    // Public API Routes
    // Programs
    app.get("/api/programs", async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (parseInt(page) - 1) * parseInt(limit);
            const result = await storage.getPrograms({
                limit: parseInt(limit),
                offset: offset
            });
            res.json({
                programs: result.programs,
                pagination: {
                    total: result.total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(result.total / parseInt(limit))
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch programs" });
        }
    });
    app.get("/api/programs/:slug", async (req, res) => {
        try {
            const program = await storage.getProgramBySlug(req.params.slug);
            if (!program) {
                return res.status(404).json({ error: "Program not found" });
            }
            res.json(program);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch program" });
        }
    });
    // Students
    app.get("/api/students", async (req, res) => {
        try {
            const { page = 1, limit = 10, program, year } = req.query;
            const offset = (parseInt(page) - 1) * parseInt(limit);
            const result = await storage.getStudents({
                limit: parseInt(limit),
                offset: offset,
                program: program,
                year: year ? parseInt(year) : undefined
            });
            res.json({
                students: result.students,
                pagination: {
                    total: result.total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(result.total / parseInt(limit))
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch students" });
        }
    });
    // News
    app.get("/api/news", async (req, res) => {
        try {
            const { page = 1, limit = 10, category, featured } = req.query;
            const offset = (parseInt(page) - 1) * parseInt(limit);
            const result = await storage.getNews({
                limit: parseInt(limit),
                offset: offset,
                category: category,
                featured: featured === "true" ? true : undefined
            });
            res.json({
                news: result.news,
                pagination: {
                    total: result.total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(result.total / parseInt(limit))
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch news" });
        }
    });
    app.get("/api/news/:slug", async (req, res) => {
        try {
            const news = await storage.getNewsBySlug(req.params.slug);
            if (!news) {
                return res.status(404).json({ error: "News article not found" });
            }
            res.json(news);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch news" });
        }
    });
    // Events
    app.get("/api/events", async (req, res) => {
        try {
            const { page = 1, limit = 10, upcoming } = req.query;
            const offset = (parseInt(page) - 1) * parseInt(limit);
            const result = await storage.getEvents({
                limit: parseInt(limit),
                offset: offset,
                upcoming: upcoming === "true" ? true : undefined
            });
            res.json({
                events: result.events,
                pagination: {
                    total: result.total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(result.total / parseInt(limit))
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch events" });
        }
    });
    app.get("/api/events/:slug", async (req, res) => {
        try {
            const event = await storage.getEventBySlug(req.params.slug);
            if (!event) {
                return res.status(404).json({ error: "Event not found" });
            }
            res.json(event);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch event" });
        }
    });
    // Recruitments
    app.get("/api/recruitments", async (req, res) => {
        try {
            const { page = 1, limit = 10, type } = req.query;
            const offset = (parseInt(page) - 1) * parseInt(limit);
            const result = await storage.getRecruitments({
                limit: parseInt(limit),
                offset: offset,
                type: type
            });
            res.json({
                recruitments: result.recruitments,
                pagination: {
                    total: result.total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(result.total / parseInt(limit))
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch recruitments" });
        }
    });
    app.get("/api/recruitments/:slug", async (req, res) => {
        try {
            const recruitment = await storage.getRecruitmentBySlug(req.params.slug);
            if (!recruitment) {
                return res.status(404).json({ error: "Recruitment not found" });
            }
            res.json(recruitment);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch recruitment" });
        }
    });
    // Contacts
    app.post("/api/contacts", async (req, res) => {
        try {
            const validatedData = insertContactSchema.parse(req.body);
            const contact = await storage.createContact(validatedData);
            res.status(201).json(contact);
        }
        catch (error) {
            console.error("Create contact error:", error);
            res.status(400).json({ error: "Invalid contact data" });
        }
    });
    // Image upload endpoint
    app.post("/api/upload", upload.single("image"), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            const folder = req.body.folder || "stem-center";
            const imageUrl = await uploadImageToCloudinary(req.file, folder);
            res.json({ imageUrl });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to upload image" });
        }
    });
    // Admin API Routes
    // Admin login
    app.post("/api/admin/login", async (req, res) => {
        try {
            const { username, password } = req.body;
            const adminUser = await storage.validateAdminUser(username, password);
            if (!adminUser) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const token = jwt.sign({ id: adminUser.id, username: adminUser.username }, JWT_SECRET, { expiresIn: "24h" });
            res.json({ token, user: { id: adminUser.id, username: adminUser.username } });
        }
        catch (error) {
            res.status(500).json({ error: "Login failed" });
        }
    });
    // Admin protected routes
    app.use("/api/admin", authenticateAdmin);
    // Admin dashboard stats
    app.get("/api/admin/stats", async (req, res) => {
        try {
            const [programs, students, news, events, recruitments, contacts] = await Promise.all([
                storage.getPrograms(),
                storage.getStudents(),
                storage.getNews(),
                storage.getEvents(),
                storage.getRecruitments(),
                storage.getContacts({ processed: false })
            ]);
            res.json({
                totalPrograms: programs.total,
                totalStudents: students.total,
                totalNews: news.total,
                totalEvents: events.total,
                totalRecruitments: recruitments.total,
                unprocessedContacts: contacts.total
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch stats" });
        }
    });
    // Admin Programs CRUD
    app.get("/api/admin/programs", async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (parseInt(page) - 1) * parseInt(limit);
            const result = await storage.getPrograms({
                limit: parseInt(limit),
                offset: offset
            });
            res.json({
                programs: result.programs,
                pagination: {
                    total: result.total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(result.total / parseInt(limit))
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch programs" });
        }
    });
    app.post("/api/admin/programs", async (req, res) => {
        try {
            const validatedData = insertProgramSchema.parse(req.body);
            const program = await storage.createProgram(validatedData);
            res.status(201).json(program);
        }
        catch (error) {
            res.status(400).json({ error: "Invalid program data" });
        }
    });
    app.put("/api/admin/programs/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const validatedData = insertProgramSchema.partial().parse(req.body);
            const program = await storage.updateProgram(id, validatedData);
            res.json(program);
        }
        catch (error) {
            res.status(400).json({ error: "Failed to update program" });
        }
    });
    app.delete("/api/admin/programs/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await storage.deleteProgram(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete program" });
        }
    });
    // Admin Students CRUD
    app.get("/api/admin/students", async (req, res) => {
        try {
            const { page = 1, limit = 10, program, year } = req.query;
            const offset = (parseInt(page) - 1) * parseInt(limit);
            const result = await storage.getStudents({
                limit: parseInt(limit),
                offset: offset,
                program: program,
                year: year ? parseInt(year) : undefined
            });
            res.json({
                students: result.students,
                pagination: {
                    total: result.total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(result.total / parseInt(limit))
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch students" });
        }
    });
    app.post("/api/admin/students", async (req, res) => {
        try {
            const validatedData = insertStudentSchema.parse(req.body);
            const student = await storage.createStudent(validatedData);
            res.status(201).json(student);
        }
        catch (error) {
            res.status(400).json({ error: "Invalid student data" });
        }
    });
    app.put("/api/admin/students/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const validatedData = insertStudentSchema.partial().parse(req.body);
            const student = await storage.updateStudent(id, validatedData);
            res.json(student);
        }
        catch (error) {
            res.status(400).json({ error: "Failed to update student" });
        }
    });
    app.delete("/api/admin/students/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await storage.deleteStudent(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete student" });
        }
    });
    // Admin News CRUD
    app.get("/api/admin/news", async (req, res) => {
        try {
            const { page = 1, limit = 10, category } = req.query;
            const offset = (parseInt(page) - 1) * parseInt(limit);
            const result = await storage.getNews({
                limit: parseInt(limit),
                offset: offset,
                category: category
            });
            res.json({
                news: result.news,
                pagination: {
                    total: result.total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(result.total / parseInt(limit))
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch news" });
        }
    });
    app.post("/api/admin/news", async (req, res) => {
        try {
            const validatedData = insertNewsSchema.parse(req.body);
            const news = await storage.createNews(validatedData);
            res.status(201).json(news);
        }
        catch (error) {
            res.status(400).json({ error: "Invalid news data" });
        }
    });
    app.put("/api/admin/news/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const validatedData = insertNewsSchema.partial().parse(req.body);
            const news = await storage.updateNews(id, validatedData);
            res.json(news);
        }
        catch (error) {
            console.error("Update news error:", error);
            res.status(400).json({ error: "Failed to update news" });
        }
    });
    app.delete("/api/admin/news/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await storage.deleteNews(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete news" });
        }
    });
    // Admin Events CRUD
    app.get("/api/admin/events", async (req, res) => {
        try {
            const { page = 1, limit = 10, upcoming } = req.query;
            const offset = (parseInt(page) - 1) * parseInt(limit);
            const result = await storage.getEvents({
                limit: parseInt(limit),
                offset: offset,
                upcoming: upcoming === "true" ? true : undefined
            });
            res.json({
                events: result.events,
                pagination: {
                    total: result.total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(result.total / parseInt(limit))
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch events" });
        }
    });
    app.post("/api/admin/events", async (req, res) => {
        try {
            const validatedData = insertEventSchema.parse(req.body);
            const event = await storage.createEvent(validatedData);
            res.status(201).json(event);
        }
        catch (error) {
            res.status(400).json({ error: "Invalid event data" });
        }
    });
    app.put("/api/admin/events/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const validatedData = insertEventSchema.partial().parse(req.body);
            const event = await storage.updateEvent(id, validatedData);
            res.json(event);
        }
        catch (error) {
            res.status(400).json({ error: "Failed to update event" });
        }
    });
    app.delete("/api/admin/events/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await storage.deleteEvent(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete event" });
        }
    });
    // Admin Recruitments CRUD
    app.get("/api/admin/recruitments", async (req, res) => {
        try {
            const { page = 1, limit = 10, type } = req.query;
            const offset = (parseInt(page) - 1) * parseInt(limit);
            const result = await storage.getRecruitments({
                limit: parseInt(limit),
                offset: offset,
                type: type
            });
            res.json({
                recruitments: result.recruitments,
                pagination: {
                    total: result.total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(result.total / parseInt(limit))
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch recruitments" });
        }
    });
    app.post("/api/admin/recruitments", async (req, res) => {
        try {
            const validatedData = insertRecruitmentSchema.parse(req.body);
            const recruitment = await storage.createRecruitment(validatedData);
            res.status(201).json(recruitment);
        }
        catch (error) {
            res.status(400).json({ error: "Invalid recruitment data" });
        }
    });
    app.put("/api/admin/recruitments/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const validatedData = insertRecruitmentSchema.partial().parse(req.body);
            const recruitment = await storage.updateRecruitment(id, validatedData);
            res.json(recruitment);
        }
        catch (error) {
            res.status(400).json({ error: "Failed to update recruitment" });
        }
    });
    app.delete("/api/admin/recruitments/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await storage.deleteRecruitment(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete recruitment" });
        }
    });
    // Admin Contacts management
    app.get("/api/admin/contacts", async (req, res) => {
        try {
            const { page = 1, limit = 10, processed } = req.query;
            const offset = (parseInt(page) - 1) * parseInt(limit);
            const result = await storage.getContacts({
                limit: parseInt(limit),
                offset: offset,
                processed: processed === "true" ? true : processed === "false" ? false : undefined
            });
            res.json({
                contacts: result.contacts,
                pagination: {
                    total: result.total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(result.total / parseInt(limit))
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch contacts" });
        }
    });
    app.put("/api/admin/contacts/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const { processed } = req.body;
            const contact = await storage.updateContact(id, { processed });
            res.json(contact);
        }
        catch (error) {
            res.status(400).json({ error: "Failed to update contact" });
        }
    });
    app.delete("/api/admin/contacts/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await storage.deleteContact(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete contact" });
        }
    });
    const httpServer = createServer(app);
    return httpServer;
}
