import { prisma } from "@/config";

async function getActivitiesWithSubscriptions(userId: number) {
  return prisma.activity.findMany({
    include: {
      ActivitySubscription: {
        where: {
          userId: userId,
        },
      },
    },
  });
}

const activitiesRepository = {
  getActivitiesWithSubscriptions,
};

export default activitiesRepository;
