export type RoadMap = {
  currentStepKey: string;
  steps: RoadMapStep[];
};

export type RoadMapStep = {
  step: number;
  key: string;
  title: string;
  subtitle: string;
  status: string;
};
