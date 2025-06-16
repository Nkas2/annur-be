import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  //   const roles = ["admin", "bendahara"];

  //   for (const role of roles) {
  //     await prisma.role.upsert({
  //       where: {
  //         name: role,
  //       },
  //       update: {},
  //       create: { name: role },
  //     });
  //   }

  //   console.log("rolse seed");

  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });

  await prisma.user.upsert({
    where: {
      email: "admin@example.com", // pastikan ini unique di schema
    },
    update: {}, // bisa kasih update di sini kalau mau ubah datanya saat seed ulang
    create: {
      name: "Super Admin",
      username: "admin",
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: adminRole.id,
      created_at: new Date(),
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
