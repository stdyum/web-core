export interface SchedulePreferences {
  column: string,
  columnId: string
}

export interface Preferences {
  schedule: SchedulePreferences | null;
}
