export interface Activity {
    id: number,
    date: Date,
    startTime: string,
    endTime: string,
    activity: string,
    max_capacity: number,
    users: string[],
    professional: string,
    weekDay: string,
};