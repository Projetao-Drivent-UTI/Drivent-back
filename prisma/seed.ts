import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import faker from "@faker-js/faker";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  let activities = await prisma.activity.findFirst();
  const ticketTypes = await prisma.ticketType.findFirst();
  const hotels = await prisma.hotel.findFirst();
  const startDate = dayjs().toDate();
  const endDate = dayjs(startDate).add(2,'days').toDate();
  const middleDay = dayjs(startDate).add(1,'days').toDate();

  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: startDate,
        endsAt: endDate,
      },
    });
  }

  if (!activities) {
    await prisma.activity.createMany({
      data: [
        {
          capacity: Number(faker.random.numeric(undefined, { bannedDigits: ["1"] })),
          date: endDate,
          start: "09:00",
          end: "10:00",
          name: faker.name.firstName(),
          location: "Auditório Principal",
        },
        {
          capacity: Number(faker.random.numeric()),
          date: startDate,
          start: "14:00",
          end: "15:00",
          name: faker.name.firstName(),
          location: "Auditório Principal",
        },
        {
          capacity: Number(faker.random.numeric()),
          date: startDate,
          start: "11:00",
          end: "12:00",
          name: faker.name.firstName(),
          location: "Auditório Principal",
        },
        {
          capacity: Number(faker.random.numeric()),
          date: middleDay,
          start: "08:00",
          end: "12:00",
          name: faker.name.firstName(),
          location: "Auditório Lateral",
        },
        {
          capacity: Number(faker.random.numeric()),
          date: endDate,
          start: "07:00",
          end: "08:00",
          name: faker.name.firstName(),
          location: "Sala de Workshop",
        },
        {
          capacity: Number(faker.random.numeric()),
          date: endDate,
          start: "10:00",
          end: "10:30",
          name: faker.name.firstName(),
          location: "Sala de Workshop",
        },
      ],
    });
  }

  if (!ticketTypes) {
    await prisma.ticketType.createMany({
      data: [
        {
          isRemote: true,
          includesHotel: false,
          name: "remoto",
          price: 200,
        },
        {
          isRemote: false,
          includesHotel: true,
          name: "comhotel",
          price: 500,
        },
        {
          isRemote: false,
          includesHotel: false,
          name: "semhotel",
          price: 300,
        },
      ],
    });
  }
  if (!hotels) {
    await prisma.hotel.createMany({
      data: [
        {
          image:
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.ysH4DhEJdZ529bMnxe3ZzAHaFY%26pid%3DApi&f=1&ipt=6e2d2817d461c0405d52085ddf8e3c46b4d9fcfce887a566ff03dbd4ab853ac2&ipo=images",
          name: `Hotel Plaza ${faker.name.firstName()}`,
        },
        {
          image:
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.tourismupdate.co.za%2Fsites%2Fdefault%2Ffiles%2Fimages%2Farticle%2F202103%2Fhoughtonhotel.jpg&f=1&nofb=1&ipt=9cd1b60e4ec754741c386d62f59f97e0288b1c705abe0c6df1dc9452c53d8366&ipo=images",
          name: `Hotel Plaza ${faker.name.firstName()}`,
        },
        {
          image:
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.bYdVzzyiY0VIy1eGV24g9wHaE8%26pid%3DApi&f=1&ipt=b5407c6ee72a6d51840a818c3c807a531b38c993954918fbb33daaee3f288cd3&ipo=images",
          name: `Hotel Plaza ${faker.name.firstName()}`,
        },
      ],
    });

    const hotelsWithoutRooms = await prisma.hotel.findMany({});

    hotelsWithoutRooms.forEach(async (hotel) => {
      await prisma.room.createMany({
        data: [
          {
            capacity: 2,
            hotelId: hotel.id,
            name: `Room ${faker.name.firstName()}`,
          },
          {
            capacity: 2,
            hotelId: hotel.id,
            name: `Room ${faker.name.firstName()}`,
          },
          {
            capacity: 2,
            hotelId: hotel.id,
            name: `Room ${faker.name.firstName()}`,
          },
        ],
      });
    });
  }
  console.log({ event }, "event");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
