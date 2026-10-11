import type { ShoppingDto } from "../dto/shopping.dto";
import type { Shopping } from "../types/shopping.types";

export const mapShopping = (dto: ShoppingDto): Shopping => ({
  basis: dto.basis,
  groups: dto.groups.map((group) => ({
    id: group.id,
    title: group.title,
    itemCount: group.item_count,
    items: group.items.map((item) => ({
      id: item.id,
      sourceId: item.source_id,
      title: item.title,
      quantityG: item.quantity_g,
      imageUrl: item.image_url,
      quantityLabel: item.quantity_label,
    })),
  })),
});
