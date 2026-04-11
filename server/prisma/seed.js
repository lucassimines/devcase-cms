import { prisma } from "@src/db.js";
import bcrypt from "bcryptjs";
const bcryptSalt = Number(process.env.BCRYPT_SALT) || 0;
async function main() {
    // Seed User
    await prisma.user.createMany({
        data: [
            {
                email: "lucas.simines@gmail.com",
                name: "Lucas Simines",
                password: await bcrypt.hash("000000", bcryptSalt)
            }
        ]
    });
    const user = await prisma.user.findFirst({
        where: {
            email: "lucas.simines@gmail.com"
        }
    });
    // Seed Client
    await prisma.client.createMany({
        data: [
            {
                name: "Client 1",
                userId: user?.id ?? ""
            }
        ]
    });
    const client = await prisma.client.findFirst({
        where: {
            userId: user?.id ?? ""
        }
    });
    // Seed Task
    await prisma.task.createMany({
        data: [
            {
                title: "Task 1",
                userId: user?.id ?? "",
                clientId: client?.id ?? ""
            }
        ]
    });
}
main();
//# sourceMappingURL=seed.js.map