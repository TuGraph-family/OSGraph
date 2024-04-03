import { DownOutlined } from "@ant-design/icons";
import { ConfigProvider, Select, message, theme } from "antd";
import { debounce, isEmpty } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getExecuteFullTextQuery,
  getExecuteQueryTemplate,
  getListQueryTemplate
} from "../../services/homePage";
import styles from "./index.module.less";

export const ProjectSearch: React.FC<{
  needFixed: boolean;
  debounceTimeout?: number;
  defaultStyle?: boolean;
  onSearch?: (searchData: any) => void;
}> = ({ needFixed, debounceTimeout = 800, defaultStyle, onSearch }) => {
  const navigate = useNavigate();
  const [queryList, setQueryList] = useState<any[]>([]);
  const [state, setState] = useState<{
    querySource: string;
    templateParameterList: any[];
    textQuery: any[];
    warehouseValue: string | null;
    templateId: string;
  }>({
    querySource: "github_repo",
    templateParameterList: [],
    textQuery: [],
    warehouseValue: null,
    templateId: ""
  });
  const {
    querySource,
    templateParameterList,
    textQuery,
    warehouseValue,
    templateId
  } = state;

  const styleObj: React.CSSProperties = {
    width: needFixed ? "calc(100% - 320px)" : defaultStyle ? "320px" : "650px",
    position: needFixed ? "fixed" : "relative",
    top: needFixed ? 24 : 0,
    height: defaultStyle ? 32 : 56,
    marginLeft: defaultStyle ? 16 : 0,
    border: defaultStyle ? "1px solid #f2f2f2" : "1px solid #ffffff",
    background: defaultStyle ? "#ffffff" : ""
  };

  useEffect(() => {
    getListQueryTemplate().then((res) => {
      setQueryList(res);
    });
  }, []);

  const switchName = (parameterName: string, parameterValue: string) => {
    switch (parameterName) {
      case "start_timestamp":
        return Math.floor(
          new Date().setMonth(new Date().getMonth() - 1) / 1000
        );
      case "end_timestamp":
        return Math.floor(new Date().getTime() / 1000);
      default:
        return parameterValue;
    }
  };

  const handleJson = (templateList: any, value: string) => {
    return templateList.map(
      (item: {
        parameterName: string;
        parameterValue: string;
        valueType: string;
      }) => {
        const { parameterName, parameterValue, valueType } = item;
        return {
          parameterName: parameterName,
          parameterValue: switchName(parameterName, parameterValue || value),
          valueType: valueType
        };
      }
    );
  };
  // @ts-ignore
  const handleProjectChange = (value: any, item: any) => {
    setState({
      ...state,
      querySource: item.data.querySource,
      templateParameterList: item.data.templateParameterList,
      templateId: item.data.id,
      warehouseValue: null,
      textQuery: []
    });
  };

  const handelWarehouseSearch = useMemo(() => {
    const loadOptions = (value: string) => {
      getExecuteFullTextQuery({ indexName: querySource, keyword: value }).then(
        (res) => {
          setState({
            ...state,
            textQuery: res
          });
        }
      );
    };
    return debounce(loadOptions, debounceTimeout);
  }, [textQuery, debounceTimeout, querySource]);

  const handelWarehouseChange = (value: string) => {
    setState({
      ...state,
      warehouseValue: value
    });

    const filterList = queryList?.filter(
      (item: { templateType: string }) =>
        item.templateType === "REPO_CONTRIBUTE"
    );

    getExecuteQueryTemplate({
      templateId: templateId || filterList[0]?.id,
      templateParameterList: handleJson(
        isEmpty(templateParameterList)
          ? filterList[0]?.templateParameterList
          : templateParameterList,
        value
      )
    }).then((res) => {
      if (res?.success) {
        if (defaultStyle) {
          onSearch?.(res.data);
          return;
        }
        navigate("/result", { state: res.data });
      } else {
        message.error(res.message);
      }
    });
  };

  return (
    <div className={styles["project-search"]} style={styleObj}>
      <ConfigProvider
        theme={{
          algorithm: defaultStyle ? theme.defaultAlgorithm : theme.darkAlgorithm
        }}
      >
        <Select
          className={
            defaultStyle ? styles["default-project"] : styles["project-sel"]
          }
          popupClassName={defaultStyle ? "" : "project"}
          defaultValue="项目贡献"
          placeholder="Borderless"
          variant="borderless"
          suffixIcon={<DownOutlined className={styles["project-icon"]} />}
          onChange={handleProjectChange}
        >
          {queryList.map((item) => {
            return (
              <Select.Option
                value={item.templateType}
                key={item.templateType}
                data={item}
              >
                {item.templateName}
              </Select.Option>
            );
          })}
        </Select>
        <Select
          className={
            defaultStyle
              ? styles["default-warehouse"]
              : styles["warehouse-name"]
          }
          showSearch
          popupClassName={defaultStyle ? "" : "warehouse"}
          dropdownStyle={{ width: needFixed ? "calc(100% - 320px)" : "650px" }}
          placeholder="请输入 GitHub 仓库名称"
          optionFilterProp="children"
          variant="borderless"
          onSearch={handelWarehouseSearch}
          onChange={handelWarehouseChange}
          value={warehouseValue}
        >
          {textQuery?.map((item) => {
            return (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            );
          })}
        </Select>
      </ConfigProvider>
    </div>
  );
};
