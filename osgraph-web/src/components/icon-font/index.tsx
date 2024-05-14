import "../../assets/icons/iconfont.css";
import fonts from "../../assets/icons/iconfont.json";
import "../../assets/icons/iconfont";
import React from "react";
import styles from "./index.module.less";

export const fontFamily = "os-iconfont";

const icons = fonts.glyphs.map((icon) => {
  return {
    name: icon.name,
    unicode: String.fromCodePoint(icon.unicode_decimal),
  };
});
export const iconLoader = (type: string) => {
  const matchIcon = icons.find((icon) => {
    return icon.name === type;
  }) || { unicode: "", name: "default" };
  return matchIcon.unicode;
};

interface IconFontProps extends React.HTMLProps<HTMLSpanElement> {
  rotate?: number;
  type: string;
}

export const IconFont: React.FC<IconFontProps> = (props) => {
  const { type, rotate, style, className, ...others } = props;
  return (
    <span
      role="img"
      {...others}
      style={{
        ...style,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
      className={["anticon", className, styles["anticon"]].join(" ")}
    >
      <svg className={[styles["icon"]].join(" ")} aria-hidden="true">
        <use xlinkHref={`#${type}`}></use>
      </svg>
    </span>
  );
};
