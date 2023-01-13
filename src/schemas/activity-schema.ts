import { ActivitySubscription } from "@prisma/client";
import Joi from "joi";

export const activitySubscriptionSchema = Joi.object<Pick<ActivitySubscription, "activityId">>({
  activityId: Joi.number().integer().required(),
});
