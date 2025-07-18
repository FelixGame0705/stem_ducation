import { eventsData } from "../client/src/data/events.js";
import { newsData } from "../client/src/data/news.js";
import { programsData } from "../client/src/data/programs.js";
import { studentsData } from "../client/src/data/students.js";
import bcrypt from "bcryptjs";
export class MemStorage {
    constructor() {
        this.adminUsersData = new Map();
        this.programsData = new Map();
        this.studentsData = new Map();
        this.newsData = new Map();
        this.eventsData = new Map();
        this.recruitmentsData = new Map();
        this.contactsData = new Map();
        this.nextId = {
            adminUsers: 1,
            programs: 1,
            students: 1,
            news: 1,
            events: 1,
            recruitments: 1,
            contacts: 1,
        };
        this.initializeData();
    }
    initializeData() {
        // Initialize programs
        programsData.forEach((program, index) => {
            const fullProgram = Object.assign(Object.assign({}, program), { id: index + 1, createdAt: new Date() });
            this.programsData.set(fullProgram.id, fullProgram);
        });
        this.nextId.programs = programsData.length + 1;
        // Initialize students
        studentsData.forEach((student, index) => {
            const fullStudent = Object.assign(Object.assign({}, student), { id: index + 1, createdAt: new Date() });
            this.studentsData.set(fullStudent.id, fullStudent);
        });
        this.nextId.students = studentsData.length + 1;
        // Initialize news
        newsData.forEach((newsItem, index) => {
            var _a;
            const fullNews = Object.assign(Object.assign({}, newsItem), { id: index + 1, createdAt: new Date(), featured: (_a = newsItem.featured) !== null && _a !== void 0 ? _a : false });
            this.newsData.set(fullNews.id, fullNews);
        });
        this.nextId.news = newsData.length + 1;
        // Initialize events
        eventsData.forEach((event, index) => {
            var _a;
            const fullEvent = Object.assign(Object.assign({}, event), { id: index + 1, createdAt: new Date(), registrationRequired: (_a = event.registrationRequired) !== null && _a !== void 0 ? _a : false });
            this.eventsData.set(fullEvent.id, fullEvent);
        });
        this.nextId.events = eventsData.length + 1;
        // Initialize recruitments
        const recruitmentData = [
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
            var _a, _b;
            const fullRecruitment = Object.assign(Object.assign({}, recruitment), { id: index + 1, createdAt: new Date(), salary: (_a = recruitment.salary) !== null && _a !== void 0 ? _a : null, url: (_b = recruitment.url) !== null && _b !== void 0 ? _b : null });
            this.recruitmentsData.set(fullRecruitment.id, fullRecruitment);
        });
        this.nextId.recruitments = recruitmentData.length + 1;
    }
    async getAdminUser(id) {
        return this.adminUsersData.get(id);
    }
    async getAdminUserByUsername(username) {
        for (const user of Array.from(this.adminUsersData.values())) {
            if (user.username === username) {
                return user;
            }
        }
        return undefined;
    }
    async createAdminUser(insertUser) {
        const hashedPassword = await bcrypt.hash(insertUser.password, 10);
        const user = {
            id: this.nextId.adminUsers++,
            username: insertUser.username,
            password: hashedPassword,
            createdAt: new Date(),
        };
        this.adminUsersData.set(user.id, user);
        return user;
    }
    async validateAdminUser(username, password) {
        const user = await this.getAdminUserByUsername(username);
        if (!user)
            return null;
        const isValid = await bcrypt.compare(password, user.password);
        return isValid ? user : null;
    }
    async getPrograms(options) {
        const allPrograms = Array.from(this.programsData.values()).sort((a, b) => { var _a, _b; return (((_a = a.createdAt) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) - (((_b = b.createdAt) === null || _b === void 0 ? void 0 : _b.getTime()) || 0); });
        const total = allPrograms.length;
        if (options === null || options === void 0 ? void 0 : options.limit) {
            const start = options.offset || 0;
            const programs = allPrograms.slice(start, start + options.limit);
            return { programs, total };
        }
        return { programs: allPrograms, total };
    }
    async getProgram(id) {
        return this.programsData.get(id);
    }
    async getProgramBySlug(slug) {
        for (const program of Array.from(this.programsData.values())) {
            if (program.slug === slug) {
                return program;
            }
        }
        return undefined;
    }
    async createProgram(insertProgram) {
        const program = Object.assign(Object.assign({ id: this.nextId.programs++ }, insertProgram), { createdAt: new Date() });
        this.programsData.set(program.id, program);
        return program;
    }
    async updateProgram(id, updateData) {
        const program = this.programsData.get(id);
        if (!program)
            throw new Error("Program not found");
        const updatedProgram = Object.assign(Object.assign({}, program), updateData);
        this.programsData.set(id, updatedProgram);
        return updatedProgram;
    }
    async deleteProgram(id) {
        this.programsData.delete(id);
    }
    async getStudents(options) {
        let allStudents = Array.from(this.studentsData.values());
        if (options === null || options === void 0 ? void 0 : options.program) {
            allStudents = allStudents.filter((student) => student.program === options.program);
        }
        if (options === null || options === void 0 ? void 0 : options.year) {
            allStudents = allStudents.filter((student) => student.year === options.year);
        }
        allStudents = allStudents.sort((a, b) => { var _a, _b; return (((_a = b.createdAt) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) - (((_b = a.createdAt) === null || _b === void 0 ? void 0 : _b.getTime()) || 0); });
        const total = allStudents.length;
        if (options === null || options === void 0 ? void 0 : options.limit) {
            const start = options.offset || 0;
            const students = allStudents.slice(start, start + options.limit);
            return { students, total };
        }
        return { students: allStudents, total };
    }
    async getStudent(id) {
        return this.studentsData.get(id);
    }
    async getStudentsByProgram(program) {
        return Array.from(this.studentsData.values()).filter((student) => student.program === program);
    }
    async getStudentsByYear(year) {
        return Array.from(this.studentsData.values()).filter((student) => student.year === year);
    }
    async createStudent(insertStudent) {
        const student = Object.assign(Object.assign({ id: this.nextId.students++ }, insertStudent), { createdAt: new Date() });
        this.studentsData.set(student.id, student);
        return student;
    }
    async updateStudent(id, updateData) {
        const student = this.studentsData.get(id);
        if (!student)
            throw new Error("Student not found");
        const updatedStudent = Object.assign(Object.assign({}, student), updateData);
        this.studentsData.set(id, updatedStudent);
        return updatedStudent;
    }
    async deleteStudent(id) {
        this.studentsData.delete(id);
    }
    async getNews(options) {
        let allNews = Array.from(this.newsData.values());
        if (options === null || options === void 0 ? void 0 : options.category) {
            allNews = allNews.filter((news) => news.category === options.category);
        }
        if ((options === null || options === void 0 ? void 0 : options.featured) !== undefined) {
            allNews = allNews.filter((news) => news.featured === options.featured);
        }
        allNews = allNews.sort((a, b) => { var _a, _b; return (((_a = b.publishedAt) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) - (((_b = a.publishedAt) === null || _b === void 0 ? void 0 : _b.getTime()) || 0); });
        const total = allNews.length;
        if (options === null || options === void 0 ? void 0 : options.limit) {
            const start = options.offset || 0;
            const news = allNews.slice(start, start + options.limit);
            return { news, total };
        }
        return { news: allNews, total };
    }
    async getNewsItem(id) {
        return this.newsData.get(id);
    }
    async getNewsBySlug(slug) {
        for (const news of Array.from(this.newsData.values())) {
            if (news.slug === slug) {
                return news;
            }
        }
        return undefined;
    }
    async getFeaturedNews() {
        return Array.from(this.newsData.values())
            .filter((news) => news.featured)
            .sort((a, b) => { var _a, _b; return (((_a = b.publishedAt) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) - (((_b = a.publishedAt) === null || _b === void 0 ? void 0 : _b.getTime()) || 0); });
    }
    async getNewsByCategory(category) {
        return Array.from(this.newsData.values())
            .filter((news) => news.category === category)
            .sort((a, b) => { var _a, _b; return (((_a = b.publishedAt) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) - (((_b = a.publishedAt) === null || _b === void 0 ? void 0 : _b.getTime()) || 0); });
    }
    async createNews(insertNews) {
        var _a;
        const news = Object.assign(Object.assign({}, insertNews), { id: this.nextId.news++, createdAt: new Date(), featured: (_a = insertNews.featured) !== null && _a !== void 0 ? _a : false });
        this.newsData.set(news.id, news);
        return news;
    }
    async updateNews(id, updateData) {
        const news = this.newsData.get(id);
        if (!news)
            throw new Error("News not found");
        const updatedNews = Object.assign(Object.assign({}, news), updateData);
        this.newsData.set(id, updatedNews);
        return updatedNews;
    }
    async deleteNews(id) {
        this.newsData.delete(id);
    }
    async getEvents(options) {
        let allEvents = Array.from(this.eventsData.values());
        if (options === null || options === void 0 ? void 0 : options.upcoming) {
            const now = new Date();
            allEvents = allEvents.filter((event) => event.startDate && event.startDate >= now);
        }
        allEvents = allEvents.sort((a, b) => { var _a, _b; return (((_a = a.startDate) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) - (((_b = b.startDate) === null || _b === void 0 ? void 0 : _b.getTime()) || 0); });
        const total = allEvents.length;
        if (options === null || options === void 0 ? void 0 : options.limit) {
            const start = options.offset || 0;
            const events = allEvents.slice(start, start + options.limit);
            return { events, total };
        }
        return { events: allEvents, total };
    }
    async getEvent(id) {
        return this.eventsData.get(id);
    }
    async getEventBySlug(slug) {
        for (const event of Array.from(this.eventsData.values())) {
            if (event.slug === slug) {
                return event;
            }
        }
        return undefined;
    }
    async getUpcomingEvents() {
        const now = new Date();
        return Array.from(this.eventsData.values())
            .filter((event) => event.startDate && event.startDate >= now)
            .sort((a, b) => { var _a, _b; return (((_a = a.startDate) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) - (((_b = b.startDate) === null || _b === void 0 ? void 0 : _b.getTime()) || 0); });
    }
    async createEvent(insertEvent) {
        var _a;
        const event = Object.assign(Object.assign({}, insertEvent), { id: this.nextId.events++, createdAt: new Date(), registrationRequired: (_a = insertEvent.registrationRequired) !== null && _a !== void 0 ? _a : false });
        this.eventsData.set(event.id, event);
        return event;
    }
    async updateEvent(id, updateData) {
        const event = this.eventsData.get(id);
        if (!event)
            throw new Error("Event not found");
        const updatedEvent = Object.assign(Object.assign({}, event), updateData);
        this.eventsData.set(id, updatedEvent);
        return updatedEvent;
    }
    async deleteEvent(id) {
        this.eventsData.delete(id);
    }
    async getRecruitments(options) {
        let allRecruitments = Array.from(this.recruitmentsData.values());
        if (options === null || options === void 0 ? void 0 : options.type) {
            allRecruitments = allRecruitments.filter((recruitment) => recruitment.type === options.type);
        }
        allRecruitments = allRecruitments.sort((a, b) => { var _a, _b; return (((_a = b.deadline) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) - (((_b = a.deadline) === null || _b === void 0 ? void 0 : _b.getTime()) || 0); });
        const total = allRecruitments.length;
        if (options === null || options === void 0 ? void 0 : options.limit) {
            const start = options.offset || 0;
            const recruitments = allRecruitments.slice(start, start + options.limit);
            return { recruitments, total };
        }
        return { recruitments: allRecruitments, total };
    }
    async getRecruitment(id) {
        return this.recruitmentsData.get(id);
    }
    async getRecruitmentBySlug(slug) {
        for (const recruitment of Array.from(this.recruitmentsData.values())) {
            if (recruitment.slug === slug) {
                return recruitment;
            }
        }
        return undefined;
    }
    async createRecruitment(insertRecruitment) {
        var _a, _b;
        const recruitment = Object.assign(Object.assign({}, insertRecruitment), { id: this.nextId.recruitments++, createdAt: new Date(), salary: (_a = insertRecruitment.salary) !== null && _a !== void 0 ? _a : null, url: (_b = insertRecruitment.url) !== null && _b !== void 0 ? _b : null });
        this.recruitmentsData.set(recruitment.id, recruitment);
        return recruitment;
    }
    async updateRecruitment(id, updateData) {
        const recruitment = this.recruitmentsData.get(id);
        if (!recruitment)
            throw new Error("Recruitment not found");
        const updatedRecruitment = Object.assign(Object.assign({}, recruitment), updateData);
        this.recruitmentsData.set(id, updatedRecruitment);
        return updatedRecruitment;
    }
    async deleteRecruitment(id) {
        this.recruitmentsData.delete(id);
    }
    async getContacts(options) {
        let allContacts = Array.from(this.contactsData.values());
        if ((options === null || options === void 0 ? void 0 : options.processed) !== undefined) {
            allContacts = allContacts.filter((contact) => contact.processed === options.processed);
        }
        allContacts = allContacts.sort((a, b) => { var _a, _b; return (((_a = b.submittedAt) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) - (((_b = a.submittedAt) === null || _b === void 0 ? void 0 : _b.getTime()) || 0); });
        const total = allContacts.length;
        if (options === null || options === void 0 ? void 0 : options.limit) {
            const start = options.offset || 0;
            const contacts = allContacts.slice(start, start + options.limit);
            return { contacts, total };
        }
        return { contacts: allContacts, total };
    }
    async getContact(id) {
        return this.contactsData.get(id);
    }
    async createContact(insertContact) {
        const contact = Object.assign(Object.assign({ id: this.nextId.contacts++ }, insertContact), { submittedAt: new Date(), processed: false });
        this.contactsData.set(contact.id, contact);
        return contact;
    }
    async updateContact(id, updateData) {
        const contact = this.contactsData.get(id);
        if (!contact)
            throw new Error("Contact not found");
        const updatedContact = Object.assign(Object.assign({}, contact), updateData);
        this.contactsData.set(id, updatedContact);
        return updatedContact;
    }
    async deleteContact(id) {
        this.contactsData.delete(id);
    }
}
