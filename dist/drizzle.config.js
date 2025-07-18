export default {
    schema: "./shared/schema.ts",
    out: "./drizzle",
    dialect: "mysql",
    dbCredentials: {
        url: process.env.DATABASE_URL || "mysql://root:123456@localhost:3306/stem_center"
    }
};
