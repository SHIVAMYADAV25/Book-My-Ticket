import { pgTable, varchar, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";


export const userTable = pgTable('users', {
    id: uuid("id").primaryKey().defaultRandom(),

    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    
    password: varchar("password", { length: 255 }).notNull(), // 🔥 better than integer

    role: varchar("role", { length: 50 }),
    isVerified: boolean("is_verified"),

    verificationToken: varchar("verification_token", { length: 255 }),
    refreshToken: varchar("refresh_token", { length: 255 }),
    resetPasswordToken: varchar("reset_password_token", { length: 255 }),
    resetPasswordExpires: timestamp("reset_password_expires"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
});