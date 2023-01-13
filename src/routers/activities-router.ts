import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getActivities, postActivitySubscription } from "@/controllers";
import { activitySubscriptionSchema } from "@/schemas/activity-schema";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/", getActivities)
  .post("/subscription", validateBody(activitySubscriptionSchema), postActivitySubscription);

export { activitiesRouter };
