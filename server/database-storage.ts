import { 
  adminUsers, programs, students, news, events, contacts, recruitments,
  type AdminUser, type InsertAdminUser, type Program, type InsertProgram,
  type Student, type InsertStudent, type News, type InsertNews,
  type Event, type InsertEvent, type Contact, type InsertContact,
  type Recruitment, type InsertRecruitment
} from "../shared/schema.js";
import { getDb } from "./db.js";
import { eq, desc, asc, and, like, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import type { IStorage } from "./storage.js";

export class DatabaseStorage implements IStorage {
  // Admin Users
  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    const db = await getDb();
    const result = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return result[0];
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const db = await getDb();
    const result = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return result[0];
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const db = await getDb();
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const result = await db.insert(adminUsers).values({
      ...insertUser,
      password: hashedPassword,
    });
    
    const user = await this.getAdminUser(Number(result.insertId));
    if (!user) throw new Error('Failed to create admin user');
    return user;
  }

  async validateAdminUser(username: string, password: string): Promise<AdminUser | null> {
    const user = await this.getAdminUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Programs
  async getPrograms(options?: { limit?: number; offset?: number }): Promise<{ programs: Program[]; total: number }> {
    const db = await getDb();
    let query = db.select().from(programs).orderBy(asc(programs.createdAt));
    
    if (options?.limit) {
      if (options.offset) {
        query = query.limit(options.limit).offset(options.offset);
      } else {
        query = query.limit(options.limit);
      }
    }
    
    const programsResult = await query;
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(programs);
    return { programs: programsResult, total: countResult[0].count };
  }

  async getProgram(id: number): Promise<Program | undefined> {
    const db = await getDb();
    const result = await db.select().from(programs).where(eq(programs.id, id));
    return result[0];
  }

  async getProgramBySlug(slug: string): Promise<Program | undefined> {
    const db = await getDb();
    const result = await db.select().from(programs).where(eq(programs.slug, slug));
    return result[0];
  }

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    const db = await getDb();
    const result = await db.insert(programs).values(insertProgram);
    const program = await this.getProgram(Number(result.insertId));
    if (!program) throw new Error('Failed to create program');
    return program;
  }

  async updateProgram(id: number, updateData: Partial<InsertProgram>): Promise<Program> {
    const db = await getDb();
    await db.update(programs).set(updateData).where(eq(programs.id, id));
    const program = await this.getProgram(id);
    if (!program) throw new Error('Failed to update program');
    return program;
  }

  async deleteProgram(id: number): Promise<void> {
    const db = await getDb();
    await db.delete(programs).where(eq(programs.id, id));
  }

  // Students
  async getStudents(options?: { limit?: number; offset?: number; program?: string; year?: number }): Promise<{ students: Student[]; total: number }> {
    const db = await getDb();
    let query = db.select().from(students);
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(students);
    const conditions = [];
    
    if (options?.program) {
      conditions.push(eq(students.program, options.program));
    }
    
    if (options?.year) {
      conditions.push(eq(students.year, options.year));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
      countQuery = countQuery.where(and(...conditions));
    }
    
    query = query.orderBy(desc(students.createdAt));
    
    if (options?.limit) {
      if (options.offset) {
        query = query.limit(options.limit).offset(options.offset);
      } else {
        query = query.limit(options.limit);
      }
    }
    
    const studentsResult = await query;
    const countResult = await countQuery;
    
    return { students: studentsResult, total: countResult[0].count };
  }

  async getStudent(id: number): Promise<Student | undefined> {
    const db = await getDb();
    const result = await db.select().from(students).where(eq(students.id, id));
    return result[0];
  }

  async getStudentsByProgram(program: string): Promise<Student[]> {
    const db = await getDb();
    return await db.select().from(students).where(eq(students.program, program));
  }

  async getStudentsByYear(year: number): Promise<Student[]> {
    const db = await getDb();
    return await db.select().from(students).where(eq(students.year, year));
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const db = await getDb();
    const result = await db.insert(students).values(insertStudent);
    const student = await this.getStudent(Number(result.insertId));
    if (!student) throw new Error('Failed to create student');
    return student;
  }

  async updateStudent(id: number, updateData: Partial<InsertStudent>): Promise<Student> {
    const db = await getDb();
    await db.update(students).set(updateData).where(eq(students.id, id));
    const student = await this.getStudent(id);
    if (!student) throw new Error('Failed to update student');
    return student;
  }

  async deleteStudent(id: number): Promise<void> {
    const db = await getDb();
    await db.delete(students).where(eq(students.id, id));
  }

  // News
  async getNews(options?: { limit?: number; offset?: number; category?: string; featured?: boolean }): Promise<{ news: News[]; total: number }> {
    const db = await getDb();
    let query = db.select().from(news);
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(news);
    const conditions = [];
    
    if (options?.category) {
      conditions.push(eq(news.category, options.category));
    }
    
    if (options?.featured !== undefined) {
      conditions.push(eq(news.featured, options.featured));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
      countQuery = countQuery.where(and(...conditions));
    }
    
    query = query.orderBy(desc(news.publishedAt));
    
    if (options?.limit) {
      if (options.offset) {
        query = query.limit(options.limit).offset(options.offset);
      } else {
        query = query.limit(options.limit);
      }
    }
    
    const newsResult = await query;
    const countResult = await countQuery;
    
    return { news: newsResult, total: countResult[0].count };
  }

  async getNewsItem(id: number): Promise<News | undefined> {
    const db = await getDb();
    const result = await db.select().from(news).where(eq(news.id, id));
    return result[0];
  }

  async getNewsBySlug(slug: string): Promise<News | undefined> {
    const db = await getDb();
    const result = await db.select().from(news).where(eq(news.slug, slug));
    return result[0];
  }

  async getFeaturedNews(): Promise<News[]> {
    const db = await getDb();
    return await db.select().from(news).where(eq(news.featured, true)).orderBy(desc(news.publishedAt));
  }

  async getNewsByCategory(category: string): Promise<News[]> {
    const db = await getDb();
    return await db.select().from(news).where(eq(news.category, category)).orderBy(desc(news.publishedAt));
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const db = await getDb();
    const result = await db.insert(news).values(insertNews);
    const newsItem = await this.getNewsItem(Number(result.insertId));
    if (!newsItem) throw new Error('Failed to create news');
    return newsItem;
  }

  async updateNews(id: number, updateData: Partial<InsertNews>): Promise<News> {
    const db = await getDb();
    await db.update(news).set(updateData).where(eq(news.id, id));
    const newsItem = await this.getNewsItem(id);
    if (!newsItem) throw new Error('Failed to update news');
    return newsItem;
  }

  async deleteNews(id: number): Promise<void> {
    const db = await getDb();
    await db.delete(news).where(eq(news.id, id));
  }

  // Events
  async getEvents(options?: { limit?: number; offset?: number; upcoming?: boolean }): Promise<{ events: Event[]; total: number }> {
    const db = await getDb();
    let query = db.select().from(events);
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(events);
    
    if (options?.upcoming) {
      const condition = sql`${events.startDate} >= ${new Date()}`;
      query = query.where(condition);
      countQuery = countQuery.where(condition);
    }
    
    query = query.orderBy(asc(events.startDate));
    
    if (options?.limit) {
      if (options.offset) {
        query = query.limit(options.limit).offset(options.offset);
      } else {
        query = query.limit(options.limit);
      }
    }
    
    const eventsResult = await query;
    const countResult = await countQuery;
    
    return { events: eventsResult, total: countResult[0].count };
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const db = await getDb();
    const result = await db.select().from(events).where(eq(events.id, id));
    return result[0];
  }

  async getEventBySlug(slug: string): Promise<Event | undefined> {
    const db = await getDb();
    const result = await db.select().from(events).where(eq(events.slug, slug));
    return result[0];
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const db = await getDb();
    return await db.select().from(events)
      .where(sql`${events.startDate} >= ${new Date()}`)
      .orderBy(asc(events.startDate));
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const db = await getDb();
    const result = await db.insert(events).values(insertEvent);
    const event = await this.getEvent(Number(result.insertId));
    if (!event) throw new Error('Failed to create event');
    return event;
  }

  async updateEvent(id: number, updateData: Partial<InsertEvent>): Promise<Event> {
    const db = await getDb();
    await db.update(events).set(updateData).where(eq(events.id, id));
    const event = await this.getEvent(id);
    if (!event) throw new Error('Failed to update event');
    return event;
  }

  async deleteEvent(id: number): Promise<void> {
    const db = await getDb();
    await db.delete(events).where(eq(events.id, id));
  }

  // Recruitments
  async getRecruitments(options?: { limit?: number; offset?: number; type?: string }): Promise<{ recruitments: Recruitment[]; total: number }> {
    const db = await getDb();
    let query = db.select().from(recruitments);
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(recruitments);
    
    if (options?.type) {
      const condition = eq(recruitments.type, options.type);
      query = query.where(condition);
      countQuery = countQuery.where(condition);
    }
    
    query = query.orderBy(desc(recruitments.deadline));
    
    if (options?.limit) {
      if (options.offset) {
        query = query.limit(options.limit).offset(options.offset);
      } else {
        query = query.limit(options.limit);
      }
    }
    
    const recruitmentsResult = await query;
    const countResult = await countQuery;
    
    return { recruitments: recruitmentsResult, total: countResult[0].count };
  }

  async getRecruitment(id: number): Promise<Recruitment | undefined> {
    const db = await getDb();
    const result = await db.select().from(recruitments).where(eq(recruitments.id, id));
    return result[0];
  }

  async getRecruitmentBySlug(slug: string): Promise<Recruitment | undefined> {
    const db = await getDb();
    const result = await db.select().from(recruitments).where(eq(recruitments.slug, slug));
    return result[0];
  }

  async createRecruitment(insertRecruitment: InsertRecruitment): Promise<Recruitment> {
    const db = await getDb();
    const result = await db.insert(recruitments).values(insertRecruitment);
    const recruitment = await this.getRecruitment(Number(result.insertId));
    if (!recruitment) throw new Error('Failed to create recruitment');
    return recruitment;
  }

  async updateRecruitment(id: number, updateData: Partial<InsertRecruitment>): Promise<Recruitment> {
    const db = await getDb();
    await db.update(recruitments).set(updateData).where(eq(recruitments.id, id));
    const recruitment = await this.getRecruitment(id);
    if (!recruitment) throw new Error('Failed to update recruitment');
    return recruitment;
  }

  async deleteRecruitment(id: number): Promise<void> {
    const db = await getDb();
    await db.delete(recruitments).where(eq(recruitments.id, id));
  }

  // Contacts
  async getContacts(options?: { limit?: number; offset?: number; processed?: boolean }): Promise<{ contacts: Contact[]; total: number }> {
    const db = await getDb();
    let query = db.select().from(contacts);
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(contacts);
    
    if (options?.processed !== undefined) {
      const condition = eq(contacts.processed, options.processed);
      query = query.where(condition);
      countQuery = countQuery.where(condition);
    }
    
    query = query.orderBy(desc(contacts.submittedAt));
    
    if (options?.limit) {
      if (options.offset) {
        query = query.limit(options.limit).offset(options.offset);
      } else {
        query = query.limit(options.limit);
      }
    }
    
    const contactsResult = await query;
    const countResult = await countQuery;
    
    return { contacts: contactsResult, total: countResult[0].count };
  }

  async getContact(id: number): Promise<Contact | undefined> {
    const db = await getDb();
    const result = await db.select().from(contacts).where(eq(contacts.id, id));
    return result[0];
  }
async createContact(insertContact: InsertContact): Promise<Contact> {
  const db = await getDb();
  await db.insert(contacts).values(insertContact);

  // Truy lại theo toàn bộ thông tin (trong thực tế có thể thêm timestamp chính xác để phân biệt nếu cần)
  const contact = await db
    .select()
    .from(contacts)
    .where(
      and(
        eq(contacts.name, insertContact.name),
        eq(contacts.email, insertContact.email),
        eq(contacts.phone, insertContact.phone),
        eq(contacts.subject, insertContact.subject),
        eq(contacts.message, insertContact.message)
      )
    )
    .orderBy(desc(contacts.submittedAt)) // để lấy bản mới nhất nếu có trùng
    .limit(1)
    .then((rows:any) => rows[0]);

  if (!contact) throw new Error("Failed to retrieve inserted contact");

  return contact;
}



  async updateContact(id: number, updateData: Partial<Contact>): Promise<Contact> {
    const db = await getDb();
    await db.update(contacts).set(updateData).where(eq(contacts.id, id));
    const contact = await this.getContact(id);
    if (!contact) throw new Error('Failed to update contact');
    return contact;
  }

  async deleteContact(id: number): Promise<void> {
    const db = await getDb();
    await db.delete(contacts).where(eq(contacts.id, id));
  }
}