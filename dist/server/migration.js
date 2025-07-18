import { getDb } from "./db.js";
import { adminUsers, programs, students, news, events, recruitments } from "../shared/schema.js";
import bcrypt from "bcryptjs";
// Sample data for initial setup
const samplePrograms = [
    {
        title: "Otto Robot",
        slug: "otto-robot",
        description: "Học lập trình robot thông qua việc lắp ráp và điều khiển Otto Robot. Phát triển tư duy logic và khả năng giải quyết vấn đề.",
        ageRange: "8-12 tuổi",
        objectives: "Hiểu cơ bản về robot và cảm biến\nHọc lập trình cơ bản\nPhát triển tư duy logic\nKhả năng làm việc nhóm",
        image: "/api/placeholder/400/300",
        color: "bg-blue-500"
    },
    {
        title: "Microbit",
        slug: "microbit",
        description: "Khám phá thế giới IoT với Microbit. Học lập trình phần cứng và tạo ra các dự án thông minh.",
        ageRange: "10-14 tuổi",
        objectives: "Làm quen với IoT\nLập trình phần cứng\nTạo dự án thực tế\nKhả năng sáng tạo",
        image: "/api/placeholder/400/300",
        color: "bg-green-500"
    },
    {
        title: "Python",
        slug: "python",
        description: "Học ngôn ngữ lập trình Python từ cơ bản đến nâng cao. Tạo ra các ứng dụng và game đơn giản.",
        ageRange: "12-16 tuổi",
        objectives: "Nắm vững Python cơ bản\nTạo ứng dụng console\nHọc game development\nData analysis cơ bản",
        image: "/api/placeholder/400/300",
        color: "bg-yellow-500"
    },
    {
        title: "AI & Machine Learning",
        slug: "ai-machine-learning",
        description: "Khám phá thế giới trí tuệ nhân tạo. Học các khái niệm cơ bản về AI và tạo ra các mô hình machine learning đơn giản.",
        ageRange: "14-18 tuổi",
        objectives: "Hiểu cơ bản về AI\nTạo chatbot đơn giản\nLàm việc với data\nImage recognition",
        image: "/api/placeholder/400/300",
        color: "bg-purple-500"
    },
    {
        title: "Cloud Computing",
        slug: "cloud-computing",
        description: "Tìm hiểu về điện toán đám mây và cách triển khai ứng dụng lên cloud. Học sử dụng các dịch vụ cloud phổ biến.",
        ageRange: "16-18 tuổi",
        objectives: "Hiểu về cloud computing\nTriển khai ứng dụng web\nSử dụng AWS/Azure cơ bản\nDevOps introduction",
        image: "/api/placeholder/400/300",
        color: "bg-indigo-500"
    }
];
const sampleStudents = [
    {
        name: "Nguyễn Minh An",
        school: "THCS Lê Quý Đôn",
        grade: "Lớp 7",
        achievement: "Giải Nhì Cuộc thi Robotics",
        description: "An đã xuất sắc tạo ra robot Otto có thể nhảy múa và hát theo nhạc. Em đã thể hiện khả năng sáng tạo và tư duy logic tuyệt vời.",
        image: "/api/placeholder/300/400",
        program: "Otto Robot",
        year: 2024
    },
    {
        name: "Trần Thị Bảo",
        school: "Tiểu học Nguyễn Du",
        grade: "Lớp 5",
        achievement: "Dự án IoT xuất sắc",
        description: "Bảo đã tạo ra hệ thống tưới cây thông minh bằng Microbit, giúp cây cối trong nhà luôn được chăm sóc tốt nhất.",
        image: "/api/placeholder/300/400",
        program: "Microbit",
        year: 2024
    },
    {
        name: "Lê Văn Cường",
        school: "THPT Chu Văn An",
        grade: "Lớp 10",
        achievement: "Ứng dụng Python sáng tạo",
        description: "Cường đã phát triển một ứng dụng quản lý thời gian biểu học tập bằng Python, giúp các bạn học sinh tổ chức học tập hiệu quả hơn.",
        image: "/api/placeholder/300/400",
        program: "Python",
        year: 2024
    },
    {
        name: "Phạm Thị Duyên",
        school: "THCS Trần Hưng Đạo",
        grade: "Lớp 9",
        achievement: "Chatbot AI thông minh",
        description: "Duyên đã tạo ra chatbot AI có thể trả lời câu hỏi về khoa học tự nhiên, giúp các bạn học sinh ôn tập môn Lý và Hóa.",
        image: "/api/placeholder/300/400",
        program: "AI & Machine Learning",
        year: 2024
    }
];
const sampleNews = [
    {
        title: "Khai trương lớp học AI mới cho học sinh THPT",
        slug: "khai-truong-lop-hoc-ai-moi",
        excerpt: "Trung tâm chính thức khai trương lớp học AI dành cho học sinh THPT với nhiều dự án thực tế hấp dẫn.",
        content: `<p>Trung tâm Giáo dục STEM chính thức khai trương lớp học AI (Artificial Intelligence) dành cho học sinh THPT với chương trình học bài bản và nhiều dự án thực tế hấp dẫn.</p>

<h3>Nội dung khóa học</h3>
<p>Khóa học AI được thiết kế dành riêng cho học sinh THPT với các chủ đề:</p>
<ul>
<li>Giới thiệu về trí tuệ nhân tạo và machine learning</li>
<li>Lập trình Python cho AI</li>
<li>Xây dựng chatbot đơn giản</li>
<li>Nhận dạng hình ảnh cơ bản</li>
<li>Dự án cuối khóa với AI</li>
</ul>

<p>Khóa học kéo dài 12 tuần với 2 buổi học mỗi tuần, mỗi buổi 2 tiếng.</p>`,
        image: "/api/placeholder/600/400",
        category: "Khóa học mới",
        publishedAt: new Date("2024-01-15"),
        featured: true
    },
    {
        title: "Học viên Otto Robot giành giải thưởng quốc tế",
        slug: "hoc-vien-otto-robot-gianh-giai-thuong-quoc-te",
        excerpt: "Đội tuyển Otto Robot của trung tâm đã xuất sắc giành giải Ba tại cuộc thi World Robot Championship 2024.",
        content: `<p>Đội tuyển Otto Robot của Trung tâm Giáo dục STEM đã xuất sắc giành giải Ba tại cuộc thi World Robot Championship 2024 được tổ chức tại Singapore.</p>

<h3>Thành tích xuất sắc</h3>
<p>Với dự án "Robot Otto thông minh hỗ trợ học tập", các em học sinh đã:</p>
<ul>
<li>Lập trình robot có thể nhận diện tiếng nói</li>
<li>Tạo ra robot giáo viên ảo giúp ôn tập bài học</li>
<li>Tích hợp AI để robot có thể trả lời câu hỏi</li>
<li>Thiết kế giao diện thân thiện cho trẻ em</li>
</ul>

<p>Đây là thành tích đáng tự hào của trung tâm và động lực để các em học sinh khác cố gắng hơn nữa.</p>`,
        image: "/api/placeholder/600/400",
        category: "Thành tích",
        publishedAt: new Date("2024-01-10"),
        featured: true
    },
    {
        title: "Workshop Cloud Computing miễn phí cho học sinh",
        slug: "workshop-cloud-computing-mien-phi",
        excerpt: "Tham gia workshop Cloud Computing hoàn toàn miễn phí để khám phá thế giới điện toán đám mây.",
        content: `<p>Trung tâm Giáo dục STEM tổ chức workshop Cloud Computing miễn phí dành cho học sinh THPT và sinh viên năm nhất.</p>

<h3>Nội dung workshop</h3>
<p>Workshop sẽ bao gồm:</p>
<ul>
<li>Giới thiệu về Cloud Computing</li>
<li>Thực hành với Amazon Web Services (AWS)</li>
<li>Triển khai ứng dụng web đơn giản</li>
<li>Quản lý database trên cloud</li>
<li>Bảo mật và monitoring</li>
</ul>

<p>Workshop diễn ra vào thứ 7 hàng tuần, từ 8h đến 17h.</p>`,
        image: "/api/placeholder/600/400",
        category: "Workshop",
        publishedAt: new Date("2024-01-05"),
        featured: false
    }
];
const sampleEvents = [
    {
        title: "Cuộc thi lập trình Python 2024",
        slug: "cuoc-thi-lap-trinh-python-2024",
        description: "Cuộc thi lập trình Python dành cho học sinh THCS và THPT với nhiều giải thưởng hấp dẫn.",
        image: "/api/placeholder/600/400",
        startDate: new Date("2024-03-15"),
        endDate: new Date("2024-03-17"),
        location: "Trung tâm Giáo dục STEM",
        registrationRequired: true
    },
    {
        title: "Triển lãm Robot và AI",
        slug: "trien-lam-robot-va-ai",
        description: "Triển lãm các dự án robot và AI được tạo ra bởi học viên của trung tâm.",
        image: "/api/placeholder/600/400",
        startDate: new Date("2024-02-20"),
        endDate: new Date("2024-02-22"),
        location: "Trung tâm Hội chợ Triển lãm",
        registrationRequired: false
    },
    {
        title: "Hội thảo STEM Education",
        slug: "hoi-thao-stem-education",
        description: "Hội thảo về giáo dục STEM dành cho giáo viên và phụ huynh.",
        image: "/api/placeholder/600/400",
        startDate: new Date("2024-04-10"),
        endDate: new Date("2024-04-10"),
        location: "Hội trường Trung tâm",
        registrationRequired: true
    }
];
const sampleRecruitments = [
    {
        title: "Giáo viên lập trình Python",
        slug: "giao-vien-lap-trinh-python",
        description: "Tuyển dụng giáo viên giảng dạy lập trình Python cho học sinh THCS và THPT.",
        requirements: "Tốt nghiệp chuyên ngành Công nghệ thông tin\nKinh nghiệm giảng dạy từ 2 năm\nThành thạo Python và các framework\nKỹ năng giao tiếp tốt",
        benefits: "Lương cạnh tranh từ 15-25 triệu\nBảo hiểm đầy đủ\nMôi trường làm việc năng động\nCơ hội đào tạo và phát triển",
        deadline: new Date("2024-03-01"),
        location: "Hà Nội",
        salary: "15-25 triệu",
        type: "full-time"
    },
    {
        title: "Trợ giảng Robot",
        slug: "tro-giang-robot",
        description: "Tuyển dụng trợ giảng hỗ trợ dạy học robot cho trẻ em.",
        requirements: "Sinh viên năm 3, 4 chuyên ngành liên quan\nYêu thích làm việc với trẻ em\nKiến thức cơ bản về robot\nHọc lực khá giỏi",
        benefits: "Lương part-time 100k/buổi\nKinh nghiệm thực tế\nChứng chỉ hoàn thành\nMôi trường học tập tốt",
        deadline: new Date("2024-02-15"),
        location: "Hà Nội",
        salary: "100k/buổi",
        type: "part-time"
    }
];
async function migrate() {
    console.log("Starting migration...");
    try {
        const db = await getDb();
        // Create admin user
        const hashedPassword = await bcrypt.hash("123456", 10);
        await db.insert(adminUsers).values({
            username: "admin",
            password: hashedPassword,
        }).onDuplicateKeyUpdate({
            set: {
                password: hashedPassword
            }
        }).catch(() => {
            // Admin user already exists, ignore duplicate key error
        });
        console.log("✓ Admin user created");
        // Insert sample programs
        for (const program of samplePrograms) {
            await db.insert(programs).values(program).onDuplicateKeyUpdate({
                set: program
            });
        }
        console.log("✓ Sample programs inserted");
        // Insert sample students
        for (const student of sampleStudents) {
            await db.insert(students).values(student).onDuplicateKeyUpdate({
                set: student
            });
        }
        console.log("✓ Sample students inserted");
        // Insert sample news
        for (const newsItem of sampleNews) {
            await db.insert(news).values(newsItem).onDuplicateKeyUpdate({
                set: newsItem
            });
        }
        console.log("✓ Sample news inserted");
        // Insert sample events
        for (const event of sampleEvents) {
            await db.insert(events).values(event).onDuplicateKeyUpdate({
                set: event
            });
        }
        console.log("✓ Sample events inserted");
        // Recruitments
        await db.schema.alterTable('recruitments', (table) => {
            table.varchar('url', { length: 500 });
        });
        // Insert sample recruitments
        for (const recruitment of sampleRecruitments) {
            await db.insert(recruitments).values(Object.assign(Object.assign({}, recruitment), { url: recruitment.url || '' })).onDuplicateKeyUpdate({
                set: Object.assign(Object.assign({}, recruitment), { url: recruitment.url || '' })
            });
        }
        console.log("✓ Sample recruitments inserted");
        console.log("Migration completed successfully!");
    }
    catch (error) {
        console.error("Migration failed:", error);
        throw error;
    }
}
// Run migration if called directly
migrate()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
export { migrate };
