import { Button, Popover } from "antd";
import style from "./index.module.less";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  setLayout: (layout: string) => void;
}
const LayouSelect: React.FC<Props> = ({ setLayout }) => {
  const LAYOUT_OPTIONS = [
    {
      img: "https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*KgwCS5Fjk4MAAAAAAAAAAAAADgOBAQ/original",
      title: "Force布局",
      type: "force",
    },
  ];

  const handleClick = (type: string) => {
    setLayout(type);
  };
  return (
    <Popover
      content={
        <div className={style.layoutPopover}>
          {LAYOUT_OPTIONS.map((item) => (
            <div
              className={style.layoutItem}
              key={item.type}
              onClick={() => handleClick(item.type)}
            >
              <img src={item.img} />
              <div className={style.layoutItemText}>{item.title}</div>
            </div>
          ))}
        </div>
      }
    >
      <Button>布局</Button>
    </Popover>
  );
};
export default LayouSelect;
