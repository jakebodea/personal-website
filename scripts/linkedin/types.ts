export type TimelineItem = {
  startDate: string;
  endDate: string;
  image: string;
  title: string;
  location: string;
  bullets: string[];
};

export type LinkedInDateParts = {
  month: string;
  monthNumber: number;
  year: number;
  isPresent: boolean;
};

export type LinkedInExperienceEntry = {
  id: string;
  title: string;
  company: string;
  location: string;
  startDateRaw: string;
  endDateRaw: string;
  startDate: LinkedInDateParts;
  endDate: LinkedInDateParts | null;
  isCurrentRole: boolean;
  description: string;
  bullets: string[];
};
