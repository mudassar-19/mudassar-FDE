// Single gate for every Phase-3 "alive" effect (custom cursor, trail,
// spotlight, particles, magnetic buttons, card tilt, click ripples).
// Touch devices have no hover cursor to enhance, and prefers-reduced-motion
// means the visitor explicitly asked for less movement on screen.
export const prefersReducedEffects = (): boolean => {
  if (typeof window === "undefined") return true;
  const isTouch =
    window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return isTouch || reducedMotion;
};
