import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    await pool.query('ALTER TABLE "KnowledgeDocument" ALTER COLUMN "embedding" TYPE vector(384);');
    console.log("Column altered successfully");
  } catch (error) {
    console.error("Failed:", error);
  } finally {
    pool.end();
  }
}

run();
