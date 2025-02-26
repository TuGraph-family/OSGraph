import { useEffect, useState } from "react";

import ExtendParams from "../extend-params";
import { translatorParamsName } from "../project-search/translator/transParamsName";
import style from "./index.module.less";
import { ITemplateParameterItem } from "../../interfaces";

interface Props {
  title: string;
  templateId: string;
  path: string;
  onSearch?: (params: any) => void;
  templateParameterList?: any;
}
const GraphMenuItem: React.FC<Props> = ({ title, templateId, templateParameterList, onSearch, path }) => {
  const [value, setValue] = useState("");

  const onChangeParams = (data: any, isinit = false) => {
    const newParams = Object.keys(data)?.map((key) => {

      return `${key}=${translatorParamsName(key, data[key], "")}`;
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

    const defaultValue: any = {}
    templateParameterList?.forEach((item: ITemplateParameterItem) => {
      defaultValue[item.parameterName] = item?.parameterValue
    })

    onChangeParams(defaultValue, true);
  }, []);

  return (
    <li className="g6-contextmenu-li" onClick={() => onSearch?.(value)}>
      <div className={style.graphMenuItem}>
        <div>{title}</div>
        <ExtendParams
          templateId={templateId}
          path={path}
          onChangeParams={onChangeParams}
          placement="rightTop"
          popupContainer={
            document.getElementsByClassName(
              "g6-contextmenu"
            )?.[0] as HTMLElement
          }
          templateParameterList={templateParameterList}
        />
      </div>
    </li>
  );
};

export default GraphMenuItem;
