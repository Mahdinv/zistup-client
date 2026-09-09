import { httpClient } from "@/shared/api";
import type { ShoppingForm } from "../schemas/shopping.schema";
import type { FreeShopping, LimitedShopping } from "./shopping.types";

export async function getFreeShoppings(): Promise<FreeShopping[]> {
  const response = await httpClient.get("/users/free-shopping");
  return response.data.items;
}

export async function getLimitedShopping(): Promise<LimitedShopping[]> {
  const response = await httpClient.get("/users/limited-shopping");
  return response.data.items;
}

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
