export type Diet = {
  id: number;
  title: string;
  subTitle: string;
  image: string;
  focus: string;
  duration: string;
  level: string;
  desc: string;
  createdAt: string;
  positiveTag: string[];
  negativeTeg: string[];
  questions: {
    health: string;
    price: string;
    environment: string;
    loyal: string;
  }[];
};
