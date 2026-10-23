import type { Transition } from "framer-motion";

// Measured from the reference: the header grows in place while the menu
// enters independently, with a small spring overshoot and ~0.75s settling.
export const profileLayoutTransition: Transition = {
  type: "spring",
  stiffness: 160,
  damping: 26,
  mass: 1,
  restDelta: 0.3,
  restSpeed: 5,
};
