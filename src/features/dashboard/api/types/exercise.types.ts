export type Exercise = {
  id: number;
  category: string;
  sport: string;
  label: string;
  intensity: string;
  met: number;
};

export type ExerciseSearchResponse = {
  success: boolean;
  count: number;
  items: Exercise[];
};

// Form submission contract; map to the registration API once it is available.
export type PhysicalActivitySubmission = {
  exercise: Exercise;
  durationMinutes: number;
  calories: number | null;
};
