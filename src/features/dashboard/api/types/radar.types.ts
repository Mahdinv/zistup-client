export type RadarAxisKey = "health" | "environment" | "cost" | "accessibility";

export type RadarData = {
  axis_order: RadarAxisKey[];
  score_values: (number | null)[];
};

export type RadarResponse = {
  success: boolean;
  data: RadarData | null;
};
