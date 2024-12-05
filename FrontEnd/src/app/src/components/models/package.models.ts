export interface Package {
  name: string,
  description: string,
  price?: number,
  userId?: number,
  activities: ActivityPackage[],
  expirationDate: Date;
  active: Boolean;
}

export interface ActivityPackage {
  activityId: number,
  name: string,
  quantity: number,
}
