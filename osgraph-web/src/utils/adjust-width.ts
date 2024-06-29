import { isIOS } from "./isMobile";

export const adjustWidth = () => {
  if (isIOS()) {
    const innerWidth = window.screen.width;
    const root = document.getElementById("root");
    if (root) {
      root.style.width = `${innerWidth * 4}px`;
    }
  }
};

export const resetClientWidth = () => {
  /* 在初次加载和视口大小变化时调整高度 */
  adjustWidth();
  window.addEventListener("resize", adjustWidth);
};
