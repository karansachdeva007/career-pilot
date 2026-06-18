import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { pipeline } from "@xenova/transformers";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function processDirectory(dirPath: string, category: string, extractor: any) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (file.endsWith(".md")) {
      const fullPath = path.join(dirPath, file);
      const content = fs.readFileSync(fullPath, "utf-8");
      const title = file.replace(".md", "");
      
      console.log(`Processing: ${category} / ${title}...`);
      
      const output = await extractor(content, { pooling: 'mean', normalize: true });
      const vector = Array.from(output.data);
      
      const vectorStr = `[${vector.join(",")}]`;

      await prisma.$executeRaw`
        INSERT INTO "KnowledgeDocument" ("id", "category", "title", "content", "embedding")
        VALUES (gen_random_uuid()::text, ${category}, ${title}, ${content}, ${vectorStr}::vector)
      `;
      console.log(`Inserted ${title} into knowledge base.`);
    }
  }
}

async function main() {
  console.log("Seeding Knowledge Base...");
  const baseDir = path.join(process.cwd(), "knowledge-base");
  
  if (!fs.existsSync(baseDir)) {
    console.error("No knowledge-base directory found.");
    return;
  }
  
  await prisma.$executeRaw`TRUNCATE TABLE "KnowledgeDocument"`;

  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  const categories = fs.readdirSync(baseDir);
  for (const category of categories) {
    const categoryPath = path.join(baseDir, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      await processDirectory(categoryPath, category, extractor);
    }
  }

  console.log("Seeding completed!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
