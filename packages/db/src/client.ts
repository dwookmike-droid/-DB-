import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __onestopPrisma__: PrismaClient | undefined;
}

export const prisma =
  globalThis.__onestopPrisma__ ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__onestopPrisma__ = prisma;
}
