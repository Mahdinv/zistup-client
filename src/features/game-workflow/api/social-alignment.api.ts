import { httpClient } from "@/shared/api";
import type { SocialAlignmentForm } from "../schemas/social-alignment.schema";

export async function addSocialAlignment(data: SocialAlignmentForm) {
  const finalData = {
    items: data.items.map(({ foodGroupId, x }) => ({
      foodGroupId,
      x,
    })),
  };
  const response = await httpClient.post("/users/social-alignment", finalData);
  return response;
}
