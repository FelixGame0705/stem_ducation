import {
  adminUsers,
  programs,
  students,
  news,
  events,
  contacts,
  recruitments,
  type AdminUser,
  type InsertAdminUser,
  type Program,
  type InsertProgram,
  type Student,
  type InsertStudent,
  type News,
  type InsertNews,
  type Event,
  type InsertEvent,
  type Contact,
  type InsertContact,
  type Recruitment,
  type InsertRecruitment,
} from "../shared/schema.js";
import { eventsData } from "../client/src/data/events.js";
import { newsData } from "../client/src/data/news.js";
import { programsData } from "../client/src/data/programs.js";
import { studentsData } from "../client/src/data/students.js";
import bcrypt from "bcryptjs";
import { DatabaseStorage } from "./database-storage.js";
// Using in-memory storage for Replit compatibility

export interface IStorage {
  // Admin Users
  getAdminUser(id: number): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  validateAdminUser(
    username: string,
    password: string,
  ): Promise<AdminUser | null>;

  // Programs
  getPrograms(options?: {
    limit?: number;
    offset?: number;
  }): Promise<{ programs: Program[]; total: number }>;
  getProgram(id: number): Promise<Program | undefined>;
  getProgramBySlug(slug: string): Promise<Program | undefined>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgram(id: number, program: Partial<InsertProgram>): Promise<Program>;
  deleteProgram(id: number): Promise<void>;

  // Students
  getStudents(options?: {
    limit?: number;
    offset?: number;
    program?: string;
    year?: number;
  }): Promise<{ students: Student[]; total: number }>;
  getStudent(id: number): Promise<Student | undefined>;
  getStudentsByProgram(program: string): Promise<Student[]>;
  getStudentsByYear(year: number): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, student: Partial<InsertStudent>): Promise<Student>;
  deleteStudent(id: number): Promise<void>;

  // News
  getNews(options?: {
    limit?: number;
    offset?: number;
    category?: string;
    featured?: boolean;
  }): Promise<{ news: News[]; total: number }>;
  getNewsItem(id: number): Promise<News | undefined>;
  getNewsBySlug(slug: string): Promise<News | undefined>;
  getFeaturedNews(): Promise<News[]>;
  getNewsByCategory(category: string): Promise<News[]>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: number, news: Partial<InsertNews>): Promise<News>;
  deleteNews(id: number): Promise<void>;

  // Events
  getEvents(options?: {
    limit?: number;
    offset?: number;
    upcoming?: boolean;
  }): Promise<{ events: Event[]; total: number }>;
  getEvent(id: number): Promise<Event | undefined>;
  getEventBySlug(slug: string): Promise<Event | undefined>;
  getUpcomingEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: number): Promise<void>;

  // Recruitments
  getRecruitments(options?: {
    limit?: number;
    offset?: number;
    type?: string;
  }): Promise<{ recruitments: Recruitment[]; total: number }>;
  getRecruitment(id: number): Promise<Recruitment | undefined>;
  getRecruitmentBySlug(slug: string): Promise<Recruitment | undefined>;
  createRecruitment(recruitment: InsertRecruitment): Promise<Recruitment>;
  updateRecruitment(
    id: number,
    recruitment: Partial<InsertRecruitment>,
  ): Promise<Recruitment>;
  deleteRecruitment(id: number): Promise<void>;

  // Contacts
  getContacts(options?: {
    limit?: number;
    offset?: number;
    processed?: boolean;
  }): Promise<{ contacts: Contact[]; total: number }>;
  getContact(id: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contact: Partial<Contact>): Promise<Contact>;
  deleteContact(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private adminUsersData: Map<number, AdminUser> = new Map();
  private programsData: Map<number, Program> = new Map();
  private studentsData: Map<number, Student> = new Map();
  private newsData: Map<number, News> = new Map();
  private eventsData: Map<number, Event> = new Map();
  private recruitmentsData: Map<number, Recruitment> = new Map();
  private contactsData: Map<number, Contact> = new Map();

  private nextId = {
    adminUsers: 1,
    programs: 1,
    students: 1,
    news: 1,
    events: 1,
    recruitments: 1,
    contacts: 1,
  };

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize programs
    programsData.forEach((program, index) => {
      const fullProgram: Program = {
        ...program,
        id: index + 1,
        createdAt: new Date(),
      };
      this.programsData.set(fullProgram.id, fullProgram);
    });
    this.nextId.programs = programsData.length + 1;

    // Initialize students
    studentsData.forEach((student, index) => {
      const fullStudent: Student = {
        ...student,
        id: index + 1,
        createdAt: new Date(),
      };
      this.studentsData.set(fullStudent.id, fullStudent);
    });
    this.nextId.students = studentsData.length + 1;

    // Initialize news
    newsData.forEach((newsItem, index) => {
      const fullNews: News = {
        ...newsItem,
        id: index + 1,
        createdAt: new Date(),
        featured: newsItem.featured ?? false,
      };
      this.newsData.set(fullNews.id, fullNews);
    });
    this.nextId.news = newsData.length + 1;

    // Initialize events
    eventsData.forEach((event, index) => {
      const fullEvent: Event = {
        ...event,
        id: index + 1,
        createdAt: new Date(),
        registrationRequired: event.registrationRequired ?? false,
      };
      this.eventsData.set(fullEvent.id, fullEvent);
    });
    this.nextId.events = eventsData.length + 1;

    // Initialize recruitments
    const recruitmentData: Recruitment[] = [
      {
        id: 1,
        createdAt: new Date(),
        type: "teaching",
        title: "Giáo viên STEM",
        slug: "giao-vien-stem",
        description: "Tìm kiếm giáo viên STEM có kinh nghiệm",
        location: "Hà Nội",
        requirements: "Tốt nghiệp đại học chuyên ngành liên quan, có kinh nghiệm giảng dạy",
        benefits: "Lương cạnh tranh, môi trường làm việc năng động",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        salary: "15-25 triệu",
        url: null,
      },
    ];

    recruitmentData.forEach((recruitment, index) => {
      const fullRecruitment: Recruitment = {
        ...recruitment,
        id: index + 1,
        createdAt: new Date(),
        salary: recruitment.salary ?? null,
        url: recruitment.url ?? null,
      };
      this.recruitmentsData.set(fullRecruitment.id, fullRecruitment);
    });
    this.nextId.recruitments = recruitmentData.length + 1;
  }

  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    return this.adminUsersData.get(id);
  }

  async getAdminUserByUsername(
    username: string,
  ): Promise<AdminUser | undefined> {
    for (const user of Array.from(this.adminUsersData.values())) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: AdminUser = {
      id: this.nextId.adminUsers++,
      username: insertUser.username,
      password: hashedPassword,
      createdAt: new Date(),
    };
    this.adminUsersData.set(user.id, user);
    return user;
  }

  async validateAdminUser(
    username: string,
    password: string,
  ): Promise<AdminUser | null> {
    const user = await this.getAdminUserByUsername(username);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async getPrograms(options?: {
    limit?: number;
    offset?: number;
  }): Promise<{ programs: Program[]; total: number }> {
    const allPrograms = Array.from(this.programsData.values()).sort(
      (a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0),
    );
    const total = allPrograms.length;

    if (options?.limit) {
      const start = options.offset || 0;
      const programs = allPrograms.slice(start, start + options.limit);
      return { programs, total };
    }

    return { programs: allPrograms, total };
  }

  async getProgram(id: number): Promise<Program | undefined> {
    return this.programsData.get(id);
  }

  async getProgramBySlug(slug: string): Promise<Program | undefined> {
    for (const program of Array.from(this.programsData.values())) {
      if (program.slug === slug) {
        return program;
      }
    }
    return undefined;
  }

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    const program: Program = {
      id: this.nextId.programs++,
      ...insertProgram,
      createdAt: new Date(),
    };
    this.programsData.set(program.id, program);
    return program;
  }

  async updateProgram(
    id: number,
    updateData: Partial<InsertProgram>,
  ): Promise<Program> {
    const program = this.programsData.get(id);
    if (!program) throw new Error("Program not found");

    const updatedProgram = { ...program, ...updateData };
    this.programsData.set(id, updatedProgram);
    return updatedProgram;
  }

  async deleteProgram(id: number): Promise<void> {
    this.programsData.delete(id);
  }

  async getStudents(options?: {
    limit?: number;
    offset?: number;
    program?: string;
    year?: number;
  }): Promise<{ students: Student[]; total: number }> {
    let allStudents = Array.from(this.studentsData.values());

    if (options?.program) {
      allStudents = allStudents.filter(
        (student) => student.program === options.program,
      );
    }

    if (options?.year) {
      allStudents = allStudents.filter(
        (student) => student.year === options.year,
      );
    }

    allStudents = allStudents.sort(
      (a, b) =>
        (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0),
    );
    const total = allStudents.length;

    if (options?.limit) {
      const start = options.offset || 0;
      const students = allStudents.slice(start, start + options.limit);
      return { students, total };
    }

    return { students: allStudents, total };
  }

  async getStudent(id: number): Promise<Student | undefined> {
    return this.studentsData.get(id);
  }

  async getStudentsByProgram(program: string): Promise<Student[]> {
    return Array.from(this.studentsData.values()).filter(
      (student) => student.program === program,
    );
  }

  async getStudentsByYear(year: number): Promise<Student[]> {
    return Array.from(this.studentsData.values()).filter(
      (student) => student.year === year,
    );
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const student: Student = {
      id: this.nextId.students++,
      ...insertStudent,
      createdAt: new Date(),
    };
    this.studentsData.set(student.id, student);
    return student;
  }

  async updateStudent(
    id: number,
    updateData: Partial<InsertStudent>,
  ): Promise<Student> {
    const student = this.studentsData.get(id);
    if (!student) throw new Error("Student not found");

    const updatedStudent = { ...student, ...updateData };
    this.studentsData.set(id, updatedStudent);
    return updatedStudent;
  }

  async deleteStudent(id: number): Promise<void> {
    this.studentsData.delete(id);
  }

  async getNews(options?: {
    limit?: number;
    offset?: number;
    category?: string;
    featured?: boolean;
  }): Promise<{ news: News[]; total: number }> {
    let allNews = Array.from(this.newsData.values());

    if (options?.category) {
      allNews = allNews.filter((news) => news.category === options.category);
    }

    if (options?.featured !== undefined) {
      allNews = allNews.filter((news) => news.featured === options.featured);
    }

    allNews = allNews.sort(
      (a, b) =>
        (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0),
    );
    const total = allNews.length;

    if (options?.limit) {
      const start = options.offset || 0;
      const news = allNews.slice(start, start + options.limit);
      return { news, total };
    }

    return { news: allNews, total };
  }

  async getNewsItem(id: number): Promise<News | undefined> {
    return this.newsData.get(id);
  }

  async getNewsBySlug(slug: string): Promise<News | undefined> {
    for (const news of Array.from(this.newsData.values())) {
      if (news.slug === slug) {
        return news;
      }
    }
    return undefined;
  }

  async getFeaturedNews(): Promise<News[]> {
    return Array.from(this.newsData.values())
      .filter((news) => news.featured)
      .sort(
        (a, b) =>
          (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0),
      );
  }

  async getNewsByCategory(category: string): Promise<News[]> {
    return Array.from(this.newsData.values())
      .filter((news) => news.category === category)
      .sort(
        (a, b) =>
          (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0),
      );
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const news: News = {
      ...insertNews,
      id: this.nextId.news++,
      createdAt: new Date(),
      featured: insertNews.featured ?? false,
    };
    this.newsData.set(news.id, news);
    return news;
  }

  async updateNews(id: number, updateData: Partial<InsertNews>): Promise<News> {
    const news = this.newsData.get(id);
    if (!news) throw new Error("News not found");

    const updatedNews = { ...news, ...updateData };
    this.newsData.set(id, updatedNews);
    return updatedNews;
  }

  async deleteNews(id: number): Promise<void> {
    this.newsData.delete(id);
  }

  async getEvents(options?: {
    limit?: number;
    offset?: number;
    upcoming?: boolean;
  }): Promise<{ events: Event[]; total: number }> {
    let allEvents = Array.from(this.eventsData.values());

    if (options?.upcoming) {
      const now = new Date();
      allEvents = allEvents.filter(
        (event) => event.startDate && event.startDate >= now,
      );
    }

    allEvents = allEvents.sort(
      (a, b) =>
        (a.startDate?.getTime() || 0) - (b.startDate?.getTime() || 0),
    );
    const total = allEvents.length;

    if (options?.limit) {
      const start = options.offset || 0;
      const events = allEvents.slice(start, start + options.limit);
      return { events, total };
    }

    return { events: allEvents, total };
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.eventsData.get(id);
  }

  async getEventBySlug(slug: string): Promise<Event | undefined> {
    for (const event of Array.from(this.eventsData.values())) {
      if (event.slug === slug) {
        return event;
      }
    }
    return undefined;
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const now = new Date();
    return Array.from(this.eventsData.values())
      .filter((event) => event.startDate && event.startDate >= now)
      .sort(
        (a, b) =>
          (a.startDate?.getTime() || 0) - (b.startDate?.getTime() || 0),
      );
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const event: Event = {
      ...insertEvent,
      id: this.nextId.events++,
      createdAt: new Date(),
      registrationRequired: insertEvent.registrationRequired ?? false,
    };
    this.eventsData.set(event.id, event);
    return event;
  }

  async updateEvent(
    id: number,
    updateData: Partial<InsertEvent>,
  ): Promise<Event> {
    const event = this.eventsData.get(id);
    if (!event) throw new Error("Event not found");

    const updatedEvent = { ...event, ...updateData };
    this.eventsData.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<void> {
    this.eventsData.delete(id);
  }

  async getRecruitments(options?: {
    limit?: number;
    offset?: number;
    type?: string;
  }): Promise<{ recruitments: Recruitment[]; total: number }> {
    let allRecruitments = Array.from(this.recruitmentsData.values());

    if (options?.type) {
      allRecruitments = allRecruitments.filter(
        (recruitment) => recruitment.type === options.type,
      );
    }

    allRecruitments = allRecruitments.sort(
      (a, b) =>
        (b.deadline?.getTime() || 0) - (a.deadline?.getTime() || 0),
    );
    const total = allRecruitments.length;

    if (options?.limit) {
      const start = options.offset || 0;
      const recruitments = allRecruitments.slice(start, start + options.limit);
      return { recruitments, total };
    }

    return { recruitments: allRecruitments, total };
  }

  async getRecruitment(id: number): Promise<Recruitment | undefined> {
    return this.recruitmentsData.get(id);
  }

  async getRecruitmentBySlug(slug: string): Promise<Recruitment | undefined> {
    for (const recruitment of Array.from(this.recruitmentsData.values())) {
      if (recruitment.slug === slug) {
        return recruitment;
      }
    }
    return undefined;
  }

  async createRecruitment(
    insertRecruitment: InsertRecruitment,
  ): Promise<Recruitment> {
    const recruitment: Recruitment = {
      ...insertRecruitment,
      id: this.nextId.recruitments++,
      createdAt: new Date(),
      salary: insertRecruitment.salary ?? null,
      url: insertRecruitment.url ?? null,
    };
    this.recruitmentsData.set(recruitment.id, recruitment);
    return recruitment;
  }

  async updateRecruitment(
    id: number,
    updateData: Partial<InsertRecruitment>,
  ): Promise<Recruitment> {
    const recruitment = this.recruitmentsData.get(id);
    if (!recruitment) throw new Error("Recruitment not found");

    const updatedRecruitment = { ...recruitment, ...updateData };
    this.recruitmentsData.set(id, updatedRecruitment);
    return updatedRecruitment;
  }

  async deleteRecruitment(id: number): Promise<void> {
    this.recruitmentsData.delete(id);
  }

  async getContacts(options?: {
    limit?: number;
    offset?: number;
    processed?: boolean;
  }): Promise<{ contacts: Contact[]; total: number }> {
    let allContacts = Array.from(this.contactsData.values());

    if (options?.processed !== undefined) {
      allContacts = allContacts.filter(
        (contact) => contact.processed === options.processed,
      );
    }

    allContacts = allContacts.sort(
      (a, b) =>
        (b.submittedAt?.getTime() || 0) - (a.submittedAt?.getTime() || 0),
    );
    const total = allContacts.length;

    if (options?.limit) {
      const start = options.offset || 0;
      const contacts = allContacts.slice(start, start + options.limit);
      return { contacts, total };
    }

    return { contacts: allContacts, total };
  }

  async getContact(id: number): Promise<Contact | undefined> {
    return this.contactsData.get(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const contact: Contact = {
      id: this.nextId.contacts++,
      ...insertContact,
      submittedAt: new Date(),
      processed: false,
    };
    this.contactsData.set(contact.id, contact);
    return contact;
  }

  async updateContact(
    id: number,
    updateData: Partial<Contact>,
  ): Promise<Contact> {
    const contact = this.contactsData.get(id);
    if (!contact) throw new Error("Contact not found");

    const updatedContact = { ...contact, ...updateData };
    this.contactsData.set(id, updatedContact);
    return updatedContact;
  }

  async deleteContact(id: number): Promise<void> {
    this.contactsData.delete(id);
  }
}