export type DietAdherenceCategory = {
  key: string;
  label: string;
  consumed_g: number;
  consumption_percent: number | null;
  target_g: number;
};

export type DietAdherenceData = {
  date: string;
  status: string;
  score_display: number | null;
  score_max: number;
  has_logs: boolean;
  message_code: string;
  categories?: DietAdherenceCategory[] | null;
};

export type DietAdherenceResponse = {
  success: boolean;
  data: DietAdherenceData;
};
