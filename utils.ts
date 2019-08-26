export default function animate(draw: Function, duration: number) {
  const start = performance.now();
  requestAnimationFrame(function _animate(time) {
    let timePassed = time - start;
    if (timePassed > duration) {
      timePassed = duration;
    }
    draw(timePassed);
    if (timePassed < duration) {
      requestAnimationFrame(_animate);
    }
  });
}
