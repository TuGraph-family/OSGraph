import React, { useState, useMemo, useEffect } from "react";
import { Select, ConfigProvider, theme } from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  getExecuteQueryTemplate,
  getExecuteFullTextQuery,
  getListQueryTemplate,
} from "../../services/homePage";
import { debounce, isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.less";

export const ProjectSearch: React.FC<{
  needFixed: boolean;
  debounceTimeout?: number;
  defaultStyle?: boolean;
}> = ({ needFixed, debounceTimeout = 800, defaultStyle }) => {
  const navigate = useNavigate();
  const [queryList, setQueryList] = useState<object>([]);
  const [state, setState] = useState<{
    querySource: string;
    templateParameterList: object;
    textQuery: object;
    warehouseValue: string;
    templateId: string;
  }>({
    querySource: "github_repo",
    templateParameterList: [],
    textQuery: [],
    warehouseValue: null,
    templateId: "",
  });
  const {
    querySource,
    templateParameterList,
    textQuery,
    warehouseValue,
    templateId,
  } = state;

  const styleObj: React.CSSProperties = {
    width: needFixed ? "calc(100% - 320px)" : defaultStyle ? "320px" : "650px",
    position: needFixed ? "fixed" : "relative",
    top: needFixed ? 24 : 0,
    height: defaultStyle ? 32 : 56,
    marginLeft: defaultStyle ? 16 : 0,
    border: defaultStyle ? "1px solid #f2f2f2" : "1px solid #ffffff",
    background: defaultStyle ? "#ffffff" : "",
  };

  useEffect(() => {
    getListQueryTemplate().then((res) => {
      setQueryList(res);
    });
  }, []);

  const switchName = (parameterName: string) => {
    switch (parameterName) {
      case "start_timestamp":
        return new Date().setMonth(new Date().getMonth() - 1);
      case "end_timestamp":
        return new Date().getTime();
      default:
        return parameterName;
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
          parameterName: switchName(parameterName),
          parameterValue: !parameterValue ? value : parameterValue,
          valueType: valueType,
        };
      }
    );
  };

  const handleProjectChange = (value: string, item: any) => {
    setState({
      ...state,
      querySource: item.data.querySource,
      templateParameterList: item.data.templateParameterList,
      templateId: item.data.id,
      warehouseValue: null,
      textQuery: [],
    });
  };

  const handelWarehouseSearch = useMemo(() => {
    const loadOptions = (value: string) => {
      getExecuteFullTextQuery({ indexName: querySource, keyword: value }).then(
        (res) => {
          setState({
            ...state,
            textQuery: res,
          });
        }
      );
    };
    return debounce(loadOptions, debounceTimeout);
  }, [textQuery, debounceTimeout, querySource]);

  const handelWarehouseChange = (value: string) => {
    setState({
      ...state,
      warehouseValue: value,
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
      ),
    }).then((res) => {
      if (res?.success) {
        navigate("/result", { state: res.data });
      }
    });
  };

  return (
    <div className={styles["project-search"]} style={styleObj}>
      <ConfigProvider
        theme={{
          algorithm: defaultStyle
            ? theme.defaultAlgorithm
            : theme.darkAlgorithm,
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
          {queryList?.map((item) => {
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
