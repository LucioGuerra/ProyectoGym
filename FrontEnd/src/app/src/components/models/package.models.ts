export interface Package {
  id?: number,
  name: string,
  description: string,
  price?: number,
  userId?: number,
  activities: ActivityPackage[],
}

export interface ActivityPackage {
  activityId: number,
  quantity: number,
}
