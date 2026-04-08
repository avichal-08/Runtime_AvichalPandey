import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

export const db: NeonDatabase<typeof schema> = drizzle(process.env.DATABASE_URL!, { schema });