export type Tablemate = {
  id: number;
  name: string;
  relationshipLevel: "family" | "friend" | "colleague" | "other";
  influenceLevel: "none" | "low" | "medium" | "high";
  sharedMealsCount: number;
  createdAt: string;
};
