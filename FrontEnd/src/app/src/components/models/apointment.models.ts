export interface Appointment {
  id: number,
  date: Date,
  startTime: string,
  endTime: string,
  activity: string,
  max_capacity: number,
  participantsCount: number,
  participants?: AppointmentUser[],
  instructor?: string,
}

export interface AppointmentUser {
  id: number,
  firstName: string,
  lastName: string,
  attendance: boolean,
  picture: string,
}

export interface Instructor {
  id: number,
  firstName: string,
  lastName: string,
}

export interface AppointmentRequest {
  date?: string;
  startTime?: LocalTime;
  endTime?: LocalTime;
  activityID?: number
  instructorID?: number;
  max_capacity?: number,
  appointmentWeekDays?: DayOfWeek[];
  endDate?: string,
  updateAllFutureAppointments?: boolean;
  appointmentQuantity?: number;
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

export interface Activity {
  id?: number,
  name: string,
  description?: string,
  price?: number,
  createdAt?: Date,
}
