import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import activityService from "@/services/activity-service";

import dayjs from "dayjs";

export async function listActivies(req: AuthenticatedRequest, res: Response) {
  try {
    const { day } = req.params;
    const date = dayjs(day).toDate();
    const activity = await activityService.getActivity(date);
    return res.status(httpStatus.OK).send({
    });
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
