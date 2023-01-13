import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import activitiesService from "@/services/activities-service";
import httpStatus from "http-status";

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const activities = await activitiesService.getActivities(Number(userId));
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    if (error.name === "CannotSubscribeError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function postActivitySubscription(req: AuthenticatedRequest, res: Response) {
  const { userId, body } = req;
  const { activityId } = body;

  try {
    await activitiesService.postActivitySubscription(Number(userId), activityId);
    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    if (error.name === "CanNotSubscribeError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    if (error.name === "UserAlreadySubscribedError") {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    if (error.name === "WithoutVacanciesError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    if (error.name === "CanNotCreateActivitySubscriptionError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
