import { httpClient } from "@/shared/api";
import type { SocialAlignmentForm } from "../schemas/social-alignment.schema";
import type { SocialAlignment } from "./social-alignment.types";

export async function getSocialAlignments(): Promise<SocialAlignment[]> {
  const response = await httpClient.get("/users/social-alignment");
  return response.data.items;
}

export async function addSocialAlignment(data: SocialAlignmentForm) {
  const finalData = {
    items: data.items.map(({ foodGroupId, newPriority, x }) => ({
      foodGroupId,
      priority: newPriority,
      x,
    })),
  };
  const response = await httpClient.post("/users/social-alignment", finalData);
  return response;
}
