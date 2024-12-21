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

interface Props {
  title: string;
  templateId: string;
  onSearch?: (params: any) => void;
}
const GraphMenuItem: React.FC<Props> = ({ title, templateId, onSearch }) => {
  const [value, setValue] = useState("");

  const onChangeParams = (data: any) => {
    const newParams = Object.keys(data)?.map((key) => {
      const paramsName =
        GRAPH_EXTEND_PARAMS_MAP[GRAPH_SHARE_LINK_MAP[templateId] + key];
      return `${paramsName}=${translatorParamsName(paramsName, data[key], "")}`;
    });
    setValue(newParams?.join("&"));
  };

  useEffect(() => {
    const { startTimestamp } = getLast10YearsTimestampsInSeconds();
    const defaultValue = {};
    GRAPH_EXTEND_PARAMS_FORM[templateId]?.forEach((item) => {
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
    onChangeParams(defaultValue);
  }, []);

  return (
    <li className="g6-contextmenu-li" onClick={() => onSearch?.(value)}>
      <div className={style.graphMenuItem}>
        <div>{title}</div>
        <ExtendParams
          templateId={templateId}
          onChangeParams={onChangeParams}
          placement="rightTop"
        />
      </div>
    </li>
  );
};

export default GraphMenuItem;
