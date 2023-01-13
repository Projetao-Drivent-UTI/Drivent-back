import activitiesRepository from "@/repositories/activity-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotSubscribeError } from "./errors";
import { exclude } from "@/utils/prisma-utils";
import { redisClient } from "../../utils/redis-service";

async function getActivities(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (enrollment === null) throw notFoundError();
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (ticket === null || ticket.status !== "PAID" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotSubscribeError();
  }

  if (await redisClient.exists("activities")) {
    const cache = await redisClient.get("activities");
    return JSON.parse(cache);
  }

  const activities = await activitiesRepository.getActivitiesWithSubscriptions();
  activities.forEach((activity) => {
    activity.ActivitySubscription.forEach((activitySubscription) => {
      if (activitySubscription.userId !== userId) return exclude(activitySubscription, "userId");
    });
  });

  await redisClient.set("activities", JSON.stringify(activities));

  return activities;
}

const activitiesService = {
  getActivities,
};

export default activitiesService;
