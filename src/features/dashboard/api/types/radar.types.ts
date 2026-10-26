export type RadarAxisKey = "health" | "environment" | "cost" | "accessibility";

export type RadarAxis = {
  actual: number | null;
  target: number | null;
  value: number | null;
  plot_value: number | null;
  overflow: boolean;
  status: "ok" | "unavailable";
};

export type RadarData = {
  axis_order: RadarAxisKey[];
  axes: Record<RadarAxisKey, RadarAxis>;
};

export type RadarResponse = {
  success: boolean;
  data: RadarData | null;
};
