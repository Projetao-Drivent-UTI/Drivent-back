import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import faker from "@faker-js/faker";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  let activities = await prisma.activity.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }

  if (!activities) {
    await prisma.activity.createMany({
      data: [
        {
          capacity: Number(faker.random.numeric(undefined, { bannedDigits: ["1"] })),
          date: faker.date.future(),
          start: "09:00",
          end: "10:00",
          name: faker.name.firstName(),
          location: "Auditório Principal",
        },
        {
          capacity: Number(faker.random.numeric()),
          date: faker.date.future(),
          start: "10:00",
          end: "11:00",
          name: faker.name.firstName(),
          location: "Auditório Principal",
        },
        {
          capacity: Number(faker.random.numeric()),
          date: faker.date.future(),
          start: "11:00",
          end: "12:00",
          name: faker.name.firstName(),
          location: "Auditório Principal",
        },
        {
          capacity: Number(faker.random.numeric()),
          date: faker.date.future(),
          start: "08:00",
          end: "12:00",
          name: faker.name.firstName(),
          location: "Auditório Lateral",
        },
        {
          capacity: Number(faker.random.numeric()),
          date: faker.date.future(),
          start: "07:00",
          end: "08:00",
          name: faker.name.firstName(),
          location: "Sala de Workshop",
        },
        {
          capacity: Number(faker.random.numeric()),
          date: faker.date.future(),
          start: "10:00",
          end: "10:30",
          name: faker.name.firstName(),
          location: "Sala de Workshop",
        },
      ],
    });
  }

  console.log({ event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
