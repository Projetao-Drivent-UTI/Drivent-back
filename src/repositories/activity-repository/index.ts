import { prisma } from "@/config";

async function getActivitiesWithSubscriptions(userId?: number) {
  return prisma.activity.findMany({
    include: {
      ActivitySubscription: {
        select: {
          activityId: true,
          userId: true,
        },
      },
    },
  });
}

const activitiesRepository = {
  getActivitiesWithSubscriptions,
};

export default activitiesRepository;
