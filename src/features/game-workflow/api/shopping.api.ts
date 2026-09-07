import { httpClient } from "@/shared/api";
import type { ShoppingForm } from "../schemas/shopping.schema";

export async function addShopping({
  data,
  game,
}: {
  data: ShoppingForm;
  game: "free-shopping" | "limited-shopping";
}) {
  const url =
    game === "free-shopping"
      ? "/users/free-shopping"
      : "/users/limited-shopping";

  const finalData = {
    items: data.items.map((item) =>
      Object.fromEntries(
        Object.entries(item).filter(
          ([key]) => key !== "imageUrl" && key !== "title",
        ),
      ),
    ),
  };

  const response = await httpClient.post(url, finalData);
  return response.data;
}

export async function getFreeShopping() {
  const response = await httpClient.get("/users/free-shopping");
  return response;
}
