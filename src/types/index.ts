export interface Activity {
  id: string;
  title: string;
  description: string;
  time?: string;
  location?: string;
  links?: { text: string; url: string }[];
}

export interface DayBlock {
  id: string;
  date: string;
  title: string;
  location: string;
  activities: Activity[];
}

export interface Trip {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  days: DayBlock[];
}
