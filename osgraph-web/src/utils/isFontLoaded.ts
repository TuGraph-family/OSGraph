/**
 * file: Determine whether the os-graph font is loaded
 * author: Allen
 */

const isFontLoaded = async (fontName: string) => {
  if ("fonts" in document) {
    try {
      await document.fonts.load(`16px ${fontName}`);
      return document.fonts.check(`16px ${fontName}`);
    } catch (error) {
      console.error("Error loading font:", error);
      return false;
    }
  }
  return false;
};

export { isFontLoaded };
