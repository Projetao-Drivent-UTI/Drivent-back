import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getActivities, postActivitySubscription, getActivityDates, getActivitiesByDay } from "@/controllers";
import { activitySubscriptionSchema } from "@/schemas/activity-schema";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/", getActivities)
  .get("/dates", getActivityDates)
  .get("/all/:date", getActivitiesByDay)
  .post("/subscription", validateBody(activitySubscriptionSchema), postActivitySubscription);

export { activitiesRouter };
