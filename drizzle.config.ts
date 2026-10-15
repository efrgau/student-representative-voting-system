import { defineConfig } from "drizzle-kit";

// Dialecto SQLite para Cloudflare D1.
// Flujo: `npm run db:generate` crea SQL en ./drizzle y
// `wrangler d1 migrations apply` lo aplica al D1 local o remoto.
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
});
