const r = 4;

const shadow = () => {
  const h = new Date().getHours();
  if (6 <= h && h <= 18) {
    const rad = (h - 6) * Math.PI / 12;
    const x = Math.floor(Math.cos(rad) * r)
    const y = Math.floor(Math.sin(rad) * r)
    return {x, y}
  }
  return {x: 0, y: 0}
}

export default function (app) {
  app.directive('shadow', (...args) => {
    const curShadow = shadow()
    const el = args[0];
    const boxShadowStyle = `${curShadow.x}px ${curShadow.y}px ${r}px 0 rgba(0, 0, 0, 0.5)`;
    if (el.style.boxShadow !== boxShadowStyle)
      el.style.boxShadow = boxShadowStyle
  })
}
