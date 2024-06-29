export const adjustWidth = () => {
  const innerWidth = window.innerWidth;
  const root = document.getElementById("root");
  if (root) {
    root.style.width = `${innerWidth}px`;
  }
};

export const resetClientWidth = () => {
  /* 在初次加载和视口大小变化时调整高度 */
  adjustWidth();
  window.addEventListener("resize", adjustWidth);
};
