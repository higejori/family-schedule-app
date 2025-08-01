export interface FamilyMember {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
  color: string;
}

export interface Schedule {
  id: string;
  memberId: string;
  date: string;
  activity: string;
  locationId: string;
}

export interface Holiday {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface AppState {
  familyMembers: FamilyMember[];
  locations: Location[];
  schedules: Schedule[];
  holidays: Holiday[];
  selectedHoliday: Holiday | null;
  selectedDateRange: {
    start: string;
    end: string;
  } | null;
}