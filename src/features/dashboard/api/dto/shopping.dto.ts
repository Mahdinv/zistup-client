export type ShoppingDto = {
  basis: string;
  groups: ShoppingGroupDto[];
};

export type ShoppingGroupDto = {
  id: string;
  title: string;
  item_count: number;
  items: ShoppingItemDto[];
};

export type ShoppingItemDto = {
  id: string;
  source_id: number;
  title: string;
  quantity_g: number;
  image_url: string;
  quantity_label: string;
};
