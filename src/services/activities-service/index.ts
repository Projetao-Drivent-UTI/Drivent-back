import activitiesRepository from "@/repositories/activity-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import {
  canNotSubscribeError,
  userAlreadySubscribedError,
  withoutVacanciesError,
  canNotCreateActivitySubscriptionError,
} from "./errors";
import { exclude } from "@/utils/prisma-utils";
import dayjs from "dayjs";

async function getActivities(userId: number) {
  await hasEnrollmentAndPaidTicketOrFail(userId);

  const activities = await activitiesRepository.getActivitiesWithSubscriptions();
  activities.forEach((activity) => {
    activity.ActivitySubscription.forEach((activitySubscription) => {
      if (activitySubscription.userId !== userId) return exclude(activitySubscription, "userId");
    });
  });

  return activities;
}
async function getActivitiesByDay(userId: number, date: Date) {
  await hasEnrollmentAndPaidTicketOrFail(userId);
  console.log(date);
  const activities = await activitiesRepository.getActivitiesWithSubscriptionsByDay(date);
  activities.forEach((activity) => {
    activity.ActivitySubscription.forEach((activitySubscription) => {
      if (activitySubscription.userId !== userId) return exclude(activitySubscription, "userId");
    });
  });

  return activities;
}

async function getDates(userId: number) {
  await hasEnrollmentAndPaidTicketOrFail(userId);

  const alldates = await activitiesRepository.getActivitiesDates();
  const dates: string[] = []; 
  alldates.sort((a, b) => a.date.getTime()-b.date.getTime());
  alldates.map((d) => {
    const date = dayjs(d.date).format("YYYY-MM-DD HH:mm:ss.SSS");
    if (!dates.includes(date)) {
      dates.push(date);
    }});
  return dates;
}

async function postActivitySubscription(userId: number, activityId: number) {
  await hasEnrollmentAndPaidTicketOrFail(userId);

  const activity = await activitiesRepository.getActivitiesWithSubscriptionsById(activityId);
  if (activity === null) throw notFoundError();

  const withoutVacancies = activity.ActivitySubscription.length >= activity.capacity;
  if (withoutVacancies) throw withoutVacanciesError();

  const userAlreadySubscribed = activity.ActivitySubscription.some((activity) => activity.userId === userId);
  if (userAlreadySubscribed) throw userAlreadySubscribedError();

  const activitySubscription = await activitiesRepository.createActivitySubscription({ userId, activityId });
  if (activitySubscription === null) throw canNotCreateActivitySubscriptionError();
  return;
}

async function hasEnrollmentAndPaidTicketOrFail(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (enrollment === null) throw notFoundError();
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (ticket === null || ticket.status !== "PAID" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw canNotSubscribeError();
  }
}

const activitiesService = {
  getActivities,
  postActivitySubscription,
  getDates,
  getActivitiesByDay
};

export default activitiesService;
