import { defineConfig } from "prisma/config";
import dotenv from "dotenv";
import path from "path";

// Explicitly load .env.local for Next.js projects
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
