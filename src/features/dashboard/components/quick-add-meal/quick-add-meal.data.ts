import type {
  Food,
  MealId,
  QuantityUnit,
  SearchState,
} from "./quick-add-meal.types";

export const MEALS: { id: MealId; title: string; image: string }[] = [
  { id: "lunch", title: "ناهار", image: "/pwa/add-meal/lunch.webp" },
  { id: "breakfast", title: "صبحانه", image: "/pwa/add-meal/breakfast.webp" },
  { id: "snack", title: "میان وعده", image: "/pwa/add-meal/snack.webp" },
  { id: "dinner", title: "شام", image: "/pwa/add-meal/dinner.webp" },
];
export const DEFAULT_UNITS: QuantityUnit[] = [
  { id: "bite", label: "لقمه" },
  { id: "spoon", label: "قاشق" },
  { id: "gram", label: "گرم" },
];
const riceParts: Food["parts"] = [
  {
    id: "rice",
    title: "برنج",
    kcal: 130,
    units: [
      {
        id: "rice-spoon",
        label: "قاشق",
        description: "برنج پخته",
        amountPerGeneral: { bite: 1, spoon: 1, gram: 0.05, serving: 12 },
      },
      {
        id: "rice-cup",
        label: "پیمانه",
        description: "برنج پخته",
        amountPerGeneral: { bite: 0.1, spoon: 0.1, gram: 0.005, serving: 1 },
      },
    ],
  },
];
export const MOCK_FOODS: Food[] = [
  {
    id: "bread-cheese-walnut",
    title: "نان پنیر گردو",
    subtitle: "صبحانه • ترکیب استاندارد",
    nutrition: { kcal: 300, protein: 12, fiber: 4, carbohydrates: 35 },
    generalUnits: [{ id: "sandwich", label: "ساندویچ" }],
    parts: [
      {
        id: "bread",
        title: "نان",
        kcal: 23,
        units: [
          {
            id: "sangak-palm",
            label: "کف دست",
            description: "نان سنگک",
            amountPerGeneral: {
              bite: 1 / 3,
              spoon: 0.5,
              gram: 0.02,
              sandwich: 2,
            },
          },
          {
            id: "barbari-slice",
            label: "برش",
            description: "نان بربری",
            amountPerGeneral: {
              bite: 0.25,
              spoon: 0.25,
              gram: 0.01,
              sandwich: 1,
            },
          },
          {
            id: "lavash-piece",
            label: "تکه",
            description: "نان لواش",
            amountPerGeneral: {
              bite: 0.5,
              spoon: 0.5,
              gram: 0.04,
              sandwich: 3,
            },
          },
        ],
      },
      {
        id: "walnut",
        title: "گردو",
        kcal: 40,
        units: [
          {
            id: "walnut-piece",
            label: "عدد",
            description: "مغز گردو",
            amountPerGeneral: { bite: 0.5, spoon: 1, gram: 0.01, sandwich: 3 },
          },
        ],
      },
      {
        id: "cheese",
        title: "پنیر",
        kcal: 30,
        units: [
          {
            id: "cheese-slice",
            label: "برش",
            description: "پنیر سفید",
            amountPerGeneral: {
              bite: 0.25,
              spoon: 0.5,
              gram: 0.01,
              sandwich: 1,
            },
          },
        ],
      },
    ],
  },
  ...[
    { id: "chelo-kebab", title: "چلو کباب", kcal: 300 },
    { id: "chelo-meat", title: "چلو گوشت", kcal: 320 },
    { id: "chelo-chicken", title: "چلو مرغ", kcal: 320 },
    { id: "chelo-grilled-chicken", title: "چلو مرغ کبابی", kcal: 320 },
  ].map(({ id, title, kcal }) => ({
    id,
    title,
    subtitle: "واحد: پرس",
    nutrition: { kcal, protein: 25, fiber: 3, carbohydrates: 42 },
    generalUnits: [{ id: "serving", label: "پرس" }],
    parts: riceParts,
  })),
];
const normalize = (value: string) =>
  value
    .trim()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\s‌]+/g, " ");
// Replace this adapter with the search service; presentation only consumes SearchState.
export function searchFoods(query: string): SearchState {
  const term = normalize(query);
  if (!term) return { status: "idle" };
  const foods = MOCK_FOODS.filter((food) =>
    normalize(`${food.title} ${food.subtitle}`).includes(term),
  );
  return foods.length ? { status: "results", foods } : { status: "not-found" };
}
export function getGeneralUnits(food: Food): QuantityUnit[] {
  return [
    ...DEFAULT_UNITS,
    ...food.generalUnits.filter(
      (unit) => !DEFAULT_UNITS.some((local) => local.id === unit.id),
    ),
  ];
}
