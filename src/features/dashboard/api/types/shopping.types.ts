export type Shopping = {
  basis: string;
  groups: ShoppingGroup[];
};

export type ShoppingGroup = {
  id: string;
  title: string;
  itemCount: number;
  items: ShoppingItem[];
};

export type ShoppingItem = {
  id: string;
  sourceId: number;
  title: string;
  quantityG: number;
  imageUrl: string;
  quantityLabel: string;
};
