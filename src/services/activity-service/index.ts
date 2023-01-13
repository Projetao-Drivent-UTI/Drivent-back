import { notFoundError } from "@/errors";
import activityRepository from "@/repositories/activity-repository";

async function getActivity(day: Date) {
    const activity = await activityRepository.findActivityByDay(day);
    if (!activity) {
      throw notFoundError();
    }
  
    return activity;
  }
  const activityService = {
    getActivity,
  };
  
  export default activityService;
