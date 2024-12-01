export interface Package {
  name: string,
  description: string,
  userId: number,
  activities: ActivityPackage[],
  expirationDate: Date;
}

export interface ActivityPackage {
  activityId: number,
  quantity: number,
}
