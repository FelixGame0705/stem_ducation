// Database configuration - adapted for Replit environment
import 'dotenv/config';
import { createConnection } from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from '../shared/schema.js';

let connection: any = null;
let db: any = null;

export async function getDb() {
  if (!db) {
    try {
      if (process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE) {
        connection = await createConnection({
          host: process.env.MYSQL_HOST,
          port: parseInt(process.env.MYSQL_PORT || '3306'),
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
        });
        db = drizzle(connection, { schema, mode: 'default' });
      }
    } catch (error) {
      console.log('Database connection failed, using in-memory storage');
      db = null;
    }
  }
  return db;
}
