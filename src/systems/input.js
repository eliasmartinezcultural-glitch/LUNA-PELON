export function createInputSystem() {
  const keys = new Set();
  let touchDirection = null;
  const normalize = (value) => value.toLowerCase();
  const onKeyDown = (event) => {
    keys.add(normalize(event.key));
    if (event.key === ' ') event.preventDefault();
  };
  const onKeyUp = (event) => keys.delete(normalize(event.key));
  addEventListener('keydown', onKeyDown);
  addEventListener('keyup', onKeyUp);

  const buttons = document.querySelectorAll('#touch button');
  for (const button of buttons) {
    const direction = button.dataset.dir;
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      touchDirection = direction;
    });
    for (const type of ['pointerup', 'pointercancel', 'pointerleave']) {
      button.addEventListener(type, () => {
        if (touchDirection === direction) touchDirection = null;
      });
    }
  }

  return {
    getVector() {
      let x = 0;
      let y = 0;
      if (keys.has('w') || keys.has('arrowup') || touchDirection === 'up') y -= 1;
      if (keys.has('s') || keys.has('arrowdown') || touchDirection === 'down') y += 1;
      if (keys.has('a') || keys.has('arrowleft') || touchDirection === 'left') x -= 1;
      if (keys.has('d') || keys.has('arrowright') || touchDirection === 'right') x += 1;
      const length = Math.hypot(x, y);
      return length ? { x: x / length, y: y / length } : { x: 0, y: 0 };
    },
    destroy() {
      removeEventListener('keydown', onKeyDown);
      removeEventListener('keyup', onKeyUp);
    },
  };
}
