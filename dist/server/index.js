import 'dotenv/config';
import express from "express";
import { registerRoutes } from "./routes.js";
import { MemStorage } from "./storage.js";
import { DatabaseStorage } from "./database-storage.js";
import { getDb } from "./db.js";
import { migrate } from "drizzle-orm/mysql2/migrator";
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse = undefined;
    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
    };
    res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
            let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
            if (capturedJsonResponse) {
                logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
            }
            if (logLine.length > 80) {
                logLine = logLine.slice(0, 79) + "…";
            }
            console.log(logLine);
        }
    });
    next();
});
(async () => {
    let storage;
    const db = await getDb();
    if (db) {
        // Tự động migrate khi dùng MySQL
        await migrate(db, { migrationsFolder: "./drizzle" });
        storage = new DatabaseStorage();
        console.log('Using MySQL database storage');
    }
    else {
        storage = new MemStorage();
        console.log('Using in-memory storage');
    }
    const server = await registerRoutes(app, storage);
    app.use((err, _req, res, _next) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ message });
        throw err;
    });
    const port = parseInt(process.env.BACKEND_PORT || '5000', 10);
    server.listen({
        port,
        host: "0.0.0.0",
        reusePort: true,
    }, () => {
        console.log(`serving on port ${port}`);
    });
})();
