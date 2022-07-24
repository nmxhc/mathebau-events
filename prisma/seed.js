const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seed() {
  const email = "mathebauevents@gmail.com";
  const name = "Mathebau Events Admin";

  // cleanup the existing database
  await prisma.admin.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("12341234", 10);

  const admin = await prisma.admin.create({
    data: {
      email,
      name,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const eventName1 = "Test Event";
  await prisma.event.deleteMany({ where: { name: eventName1 } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const event1 = await prisma.event.create({
    data: {
      name: eventName1,
      description: "Jeder wird getestet",
      startDate: new Date("2022-08-09"),
      endDate: new Date("2022-08-11"),
      location: "Mathebau",
      signupStartDate: new Date("2022-07-20"),
      signupEndDate: new Date("2022-07-25"),
      participantsLimit: 100,
    }
  });

  await prisma.eventAdmin.create({
    data: {
      admin: {
        connect: {
          id: admin.id,
        },
      },
      event: {
        connect: {
          id: event1.id,
        },
      },
    },
  });

  const eventName2 = "Test Event 2";
  await prisma.event.deleteMany({ where: { name: eventName2 } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const event2 = await prisma.event.create({
    data: {
      name: eventName1,
      description: "Jeder wird getestet 2",
      startDate: new Date("2021-08-09"),
      endDate: new Date("2021-08-11"),
      location: "Mathebauuuuuu",
      signupStartDate: new Date("2021-07-20"),
      signupEndDate: new Date("2021-07-25"),
      cost: 'Keine',
    }
  });

  await prisma.eventAdmin.create({
    data: {
      admin: {
        connect: {
          id: admin.id,
        },
      },
      event: {
        connect: {
          id: event2.id,
        },
      },
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
