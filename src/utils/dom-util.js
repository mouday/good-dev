export function getRelativePosition(element) {
  let acturalLeft = element.offsetLeft;
  let acturalTop = element.offsetTop;
  let curElement = element.offsetParent;

  while (curElement) {
    acturalLeft += curElement.offsetLeft;
    acturalTop += curElement.offsetTop;
    curElement = curElement.offsetParent;
  }

  return {
    left: acturalLeft - element.scrollLeft,
    top: acturalTop - element.scrollTop,
  };
}
