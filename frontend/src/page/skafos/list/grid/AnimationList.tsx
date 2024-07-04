export const shakeAnimation = {
  initial: { x: 0 },
  animate: {
    x: [0, 5, -5, 5, -5, 0],
    transition: { duration: 0.5, repeat: Infinity, repeatDelay: 20 },
  },
};
