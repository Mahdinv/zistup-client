import { LiaFemaleSolid, LiaMaleSolid } from "react-icons/lia";

export const genderOptions = [
  {
    title: "آقا",
    value: "male",
    icon: <LiaMaleSolid className="text-2xl" strokeWidth={0.8} />,
  },
  {
    title: "خانم",
    value: "female",
    icon: <LiaFemaleSolid className="text-2xl" strokeWidth={0.8} />,
  },
];
export const mainGoalOptions = [
  {
    title: "کاهش وزن",
    value: "weight-loss",
  },
  {
    title: "حفظ وزن",
    value: "weight-maintenance",
  },
  {
    title: "افزایش وزن",
    value: "weight-gain",
  },
];

export const focusOptions = [
  {
    title: "عضله سازی",
    value: "muscle-building",
  },
  {
    title: "تغذیه سالم",
    value: "healthy-eating",
  },
  {
    title: "محیط زیست",
    value: "environment",
  },
  {
    title: "سایر...",
    value: "others",
  },
];
