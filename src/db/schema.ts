import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const elections = sqliteTable("elections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  institutionName: text("institution_name").notNull(),
  year: integer("year").notNull(),
  status: text("status").notNull().default("active"), // 'active', 'paused', 'closed'
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const positions = sqliteTable("positions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  electionId: integer("election_id").notNull(),
  name: text("name").notNull(), // e.g. "Personero Estudiantil", "Contralor Estudiantil"
  description: text("description"),
  displayOrder: integer("display_order").notNull().default(1),
});

export const candidates = sqliteTable("candidates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  positionId: integer("position_id").notNull(),
  number: text("number").notNull(), // e.g. "01", "02", "03", "BLANCO"
  name: text("name").notNull(),
  photoUrl: text("photo_url"),
  slogan: text("slogan"),
  proposals: text("proposals"), // JSON stringified array of proposal points
  isBlank: integer("is_blank", { mode: "boolean" }).notNull().default(false),
  displayOrder: integer("display_order").notNull().default(1),
});

export const students = sqliteTable("students", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  documentId: text("document_id").notNull().unique(),
  fullName: text("full_name").notNull(),
  grade: text("grade").notNull().default("11"),
  groupName: text("group_name").notNull().default("11-1"),
  hasVoted: integer("has_voted", { mode: "boolean" }).notNull().default(false),
  votedAt: integer("voted_at", { mode: "timestamp_ms" }),
  verificationCode: text("verification_code"),
});

export const votes = sqliteTable("votes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  electionId: integer("election_id").notNull(),
  positionId: integer("position_id").notNull(),
  candidateId: integer("candidate_id").notNull(),
  studentId: integer("student_id").notNull(),
  castAt: integer("cast_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  voteToken: text("vote_token"),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  action: text("action").notNull(),
  details: text("details"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});
