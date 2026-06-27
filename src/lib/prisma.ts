import { PrismaClient } from '@prisma/client';

// Validate DATABASE_URL exists before creating PrismaClient
if (!process.env.DATABASE_URL) {
  throw new Error('Please define the DATABASE_URL environment variable');
}

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
