import { useEffect, useState } from "react";
import {
  GRAPH_EXTEND_PARAMS_FORM,
  GRAPH_EXTEND_PARAMS_MAP,
  GRAPH_SHARE_LINK_MAP,
} from "../../constants";
import ExtendParams from "../extend-params";
import { translatorParamsName } from "../project-search/translator/transParamsName";
import style from "./index.module.less";
import { getLast10YearsTimestampsInSeconds } from "../../utils/date";
import dayjs from "dayjs";
import { IOptions } from "../../interfaces";

interface Props {
  title: string;
  templateId: Record<string, any>;
  onSearch?: (params: any) => void;
}
const GraphMenuItem: React.FC<Props> = ({ title, templateId, onSearch }) => {
  const [value, setValue] = useState("");

  const onChangeParams = (data: any, isinit = false) => {
    const newParams = Object.keys(data)?.map((key) => {
      const paramsName =
        GRAPH_EXTEND_PARAMS_MAP[GRAPH_SHARE_LINK_MAP[templateId] + key];
      return `${paramsName}=${translatorParamsName(paramsName, data[key], "")}`;
    });
    setValue(newParams?.join("&"));
    if (!isinit) {
      onSearch?.(newParams?.join("&"));
      const g6ContextmenuDom =
        document.getElementsByClassName("g6-contextmenu")[0];
      if (g6ContextmenuDom && g6ContextmenuDom instanceof HTMLElement) {
        g6ContextmenuDom?.click();
      }
    }
  };

  useEffect(() => {
    const { startTimestamp } = getLast10YearsTimestampsInSeconds();
    const defaultValue: Record<string, any> = {};
    GRAPH_EXTEND_PARAMS_FORM[
      templateId as unknown as keyof typeof GRAPH_EXTEND_PARAMS_FORM
    ]?.forEach((item: IOptions) => {
      switch (true) {
        case item.type === "inputNumber":
          defaultValue[item.key] = item.defaultValue;
          break;
        case item.key === "start":
          defaultValue[item.key] = dayjs(startTimestamp * 1000).valueOf();
          break;
        case item.key === "end":
          defaultValue[item.key] = dayjs().valueOf();
          break;
      }
    });
    onChangeParams(defaultValue, true);
  }, []);

  return (
    <li className="g6-contextmenu-li" onClick={() => onSearch?.(value)}>
      <div className={style.graphMenuItem}>
        <div>{title}</div>
        <ExtendParams
          templateId={templateId}
          onChangeParams={onChangeParams}
          placement="rightTop"
          popupContainer={
            document.getElementsByClassName(
              "g6-contextmenu"
            )?.[0] as HTMLElement
          }
        />
      </div>
    </li>
  );
};

export default GraphMenuItem;
