export interface Appointment {
    id: number,
    date: Date,
    startTime: string,
    endTime: string,
    activity: string,
    max_capacity: number,
    participants_count?: number,
    participants?: AppointmentUser[],
    instructor?: string,
}

export interface AppointmentUser {
  id: number,
  firstName: string,
  lastName: string,
}

export interface AppointmentList {
    appointments: Appointment[];
}

export interface AppointmentRequest {
  date?: Date;
  startTime?: LocalTime;
  endTime?: LocalTime;
  activityID?: number
  instructorID?: number;
  max_capacity?: number,
  appointmentWeekDays?: DayOfWeek[];
  endDate?: Date
}

export interface LocalTime {
  hour: number;
  minute: number;
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}
