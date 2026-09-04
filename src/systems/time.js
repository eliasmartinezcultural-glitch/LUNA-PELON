export const MINUTES_PER_DAY = 24 * 60;

export function createWorldClock({ startMinutes = 8 * 60, timeScale = 1 }) {
  let minutes = ((startMinutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;

  return {
    update(dt) {
      if (!Number.isFinite(dt) || dt <= 0) return minutes;
      minutes = (minutes + dt * timeScale) % MINUTES_PER_DAY;
      return minutes;
    },
    getMinutes: () => minutes,
    getHour: () => Math.floor(minutes / 60),
    getLabel: () => {
      const hour = Math.floor(minutes / 60).toString().padStart(2, '0');
      const minute = Math.floor(minutes % 60).toString().padStart(2, '0');
      return `${hour}:${minute}`;
    },
  };
}
