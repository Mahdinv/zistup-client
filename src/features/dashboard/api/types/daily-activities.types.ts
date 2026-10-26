export type DailyActivity = {
  id: number;
  activity: string;
  duration: number;
  intensity: string | null;
  met: number;
  calories: number;
  date: string;
  createdAt: string;
};

export type DailyActivitiesResponse = {
  success: boolean;
  activities: DailyActivity[] | null;
  bmr: number;
  bmr_reason: string | null;
  total_calories: number;
};
