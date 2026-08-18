import { httpClient } from "@/shared/api";
import type { RoadMap } from "./road-map.types";

export async function getRoadMapList(): Promise<RoadMap> {
  const response = await httpClient.get("/user/roadmap");
  return response.data as RoadMap;
}
