import { httpClient } from "@/shared/api";
import type { ShoppingForm } from "../schemas/shopping.schema";

export async function addShopping(data: ShoppingForm) {
  const finalData = {
    items: data.items.map((item) =>
      Object.fromEntries(
        Object.entries(item).filter(
          ([key]) => key !== "imageUrl" && key !== "title",
        ),
      ),
    ),
  };
  const response = await httpClient.post("/users/free-shopping", finalData);
  return response.data;
}

export async function getFreeShopping() {
  const response = await httpClient.get("/users/free-shopping");
  return response;
}
