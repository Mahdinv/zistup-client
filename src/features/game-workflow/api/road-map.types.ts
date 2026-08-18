export type RoadMap = {
  currentStepKey: string;
  steps: RoadMapStep[];
};

export type RoadMapStep = {
  key: string;
  link: string;
  step: number;
  title: string;
  subtitle: string;
  status: string;
};
