import { PrismaClient } from "@prisma/client";

//add prisma to globalThis
declare global{
    var prisma: PrismaClient | undefined
};

const prismadb = globalThis.prisma || new PrismaClient();
// hot reloading will create a new instance each time, causing warning
if(process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;

export default prismadb;