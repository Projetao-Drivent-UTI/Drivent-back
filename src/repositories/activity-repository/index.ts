import { prisma } from "@/config";
import { Activity } from "@prisma/client";

async function findActivityByDay(day: Date) {
    return prisma.activity.findMany({
      where: {
        date: day,
      },
      include: {
        ActivitySubscription: true
      }
    });
  }
const activityRepository = {
  findActivityByDay,
};
  
export default activityRepository;