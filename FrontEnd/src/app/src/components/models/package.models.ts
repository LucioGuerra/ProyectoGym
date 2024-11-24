export interface Package {
  name: string,
  description: string,
  userId: number,
  activities: ActivityPackage[],
}

export interface ActivityPackage {
  activityId: number,
  quantity: number,
}
