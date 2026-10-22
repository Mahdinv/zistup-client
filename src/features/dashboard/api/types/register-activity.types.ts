export type RegisterActivityRequest = {
  exercise_id: number;
  duration: number;
};

export type RegisterActivityResponse = {
  success: boolean;
  activity: {
    id: number;
    exercise_id: number;
    activity: string;
    duration: number;
    met: number;
    calories: number;
    date: string;
  };
};
