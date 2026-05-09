import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import {envSchema} from "@/config/envs";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
export const prisma = new PrismaClient({ adapter });
