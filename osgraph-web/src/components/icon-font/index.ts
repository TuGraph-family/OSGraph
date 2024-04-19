import "../..//assets/icons/iconfont.css";
import fonts from "../../assets/icons/iconfont.json";

export const fontFamily = "os-iconfont";

const icons = fonts.glyphs.map((icon) => {
  return {
    name: icon.name,
    unicode: String.fromCodePoint(icon.unicode_decimal) // `\\u${icon.unicode}`,
  };
});
export const iconLoader = (type: string) => {
  const matchIcon = icons.find((icon) => {
    return icon.name === type;
  }) || { unicode: "", name: "default" };
  return matchIcon.unicode;
};
