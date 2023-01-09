import activitiesRepository from "@/repositories/activity-repository";

async function getActivities(userId: number) {
  const activities = await activitiesRepository.getActivitiesWithSubscriptions(userId);
  return activities;
}

const activitiesService = {
  getActivities,
};

export default activitiesService;
