import { prisma } from "@/config";
import { ActivitySubscription } from "@prisma/client";

async function getActivitiesWithSubscriptions() {
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
async function getActivitiesWithSubscriptionsByDay(date: Date) {
  return prisma.activity.findMany({
    where: {
      date: date
    },
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

async function getActivitiesDates() {
  return prisma.activity.findMany({
  });
}

async function getActivitiesWithSubscriptionsById(id: number) {
  return prisma.activity.findFirst({
    where: {
      id,
    },
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

async function createActivitySubscription(body: Pick<ActivitySubscription, "userId" | "activityId">) {
  return prisma.activitySubscription.create({
    data: {
      userId: body.userId,
      activityId: body.activityId,
    },
  });
}

const activitiesRepository = {
  getActivitiesWithSubscriptions,
  createActivitySubscription,
  getActivitiesWithSubscriptionsById,
  getActivitiesDates,
  getActivitiesWithSubscriptionsByDay
};

export default activitiesRepository;
