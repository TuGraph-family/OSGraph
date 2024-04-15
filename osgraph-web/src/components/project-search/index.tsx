import React, { useState, useMemo, useEffect } from "react";
import { Select, ConfigProvider, theme, message } from "antd";
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
  graphWarehouseValue?: string;
  graphProjectValue?: string;
  graphQuerySource?: string;
  graphSearchValue?: string;
  graphTemplateId?: string;
  graphParameterList?: any[];
  defaultStyle?: boolean;
  onSearch?: (searchData: any) => void;
  templateType?: string | any;
}> = ({
  needFixed,
  debounceTimeout = 800,
  defaultStyle,
  onSearch,
  templateType,
  graphWarehouseValue,
  graphProjectValue,
  graphQuerySource,
  graphSearchValue,
  graphTemplateId,
  graphParameterList,
}) => {
  const navigate = useNavigate();
  const [queryList, setQueryList] = useState<any[]>([]);
  const [state, setState] = useState<{
    querySource: string;
    templateParameterList: any[];
    textQuery: any[];
    warehouseValue: string | null;
    templateId: string;
    projectValue: string;
    placeholderValue: string;
    searchValue: string;
  }>({
    querySource: "github_repo",
    templateParameterList: graphParameterList || [],
    textQuery: [],
    warehouseValue: graphWarehouseValue || null,
    templateId: graphTemplateId || "1",
    projectValue: graphProjectValue || "REPO_CONTRIBUTE",
    placeholderValue: "请输入 GitHub 仓库名称",
    searchValue: "",
  });
  const {
    querySource,
    templateParameterList,
    textQuery,
    warehouseValue,
    templateId,
    projectValue,
    placeholderValue,
    searchValue,
  } = state;

  const placeholderName = (
    value:
      | "REPO_CONTRIBUTE"
      | "REPO_ECOLOGY"
      | "REPO_COMMUNITY"
      | "ACCT_ACTIVITY"
      | "ACCT_PARTNER"
      | "ACCT_INTEREST"
  ) => {
    const placeholder = {
      REPO_CONTRIBUTE: "请输入 GitHub 仓库名称",
      REPO_ECOLOGY: "请输入 GitHub 仓库名称",
      REPO_COMMUNITY: "请输入 GitHub 仓库名称",
      ACCT_ACTIVITY: "请输入 GitHub 账户名称",
      ACCT_PARTNER: "请输入 GitHub 账户名称",
      ACCT_INTEREST: "请输入 GitHub 账户名称",
    };
    return placeholder[value];
  };

  const styleObj: React.CSSProperties = {
    width: needFixed ? "calc(100% - 320px)" : defaultStyle ? "400px" : "650px",
    position: needFixed ? "fixed" : "relative",
    top: needFixed ? 24 : 0,
    height: defaultStyle ? 32 : 56,
    marginLeft: defaultStyle ? 16 : 0,
    border: defaultStyle ? "1px solid #f2f2f2" : "1px solid #ffffff",
    background: defaultStyle ? "#ffffff" : "",
    borderRadius: defaultStyle ? "6px" : "12px",
  };

  useEffect(() => {
    getListQueryTemplate().then((res) => {
      setQueryList(res);
    });
  }, []);

  useEffect(() => {
    if (graphQuerySource && graphSearchValue) {
      getExecuteFullTextQueryList(graphQuerySource, graphSearchValue);
    }
  }, [graphQuerySource, graphSearchValue]);

  useEffect(() => {
    if (templateType) {
      setState({
        ...state,
        projectValue: templateType,
        placeholderValue: placeholderName(templateType),
      });
    }
  }, [templateType]);

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
          valueType: valueType,
        };
      }
    );
  };

  const handleProjectChange = (value: string | any, item: any) => {
    setState({
      ...state,
      querySource: item.data.querySource,
      templateParameterList: item.data.templateParameterList,
      templateId: item.data.id,
      warehouseValue: null,
      textQuery: [],
      projectValue: value,
      placeholderValue: placeholderName(value),
    });
  };

  const getExecuteFullTextQueryList = (indexName: string, keyword: string) => {
    getExecuteFullTextQuery({ indexName, keyword }).then((res) => {
      setState({
        ...state,
        textQuery: res,
        searchValue: keyword,
      });
    });
  };

  const handelWarehouseSearch = useMemo(() => {
    const loadOptions = (value: string) => {
      getExecuteFullTextQueryList(querySource, value);
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
    const templateList = handleJson(
      isEmpty(templateParameterList)
        ? filterList[0]?.templateParameterList
        : templateParameterList,
      value
    );

    const paramsValue = templateList
      ?.map((item: { parameterValue: string }) => {
        return item.parameterValue;
      })
      .join(",");

    getExecuteQueryTemplate({
      templateId: templateId || filterList[0]?.id,
      templateParameterList: templateList,
    }).then((res) => {
      if (res?.success) {
        if (defaultStyle) {
          onSearch?.({
            searchData: res.data,
            graphTemplateId: templateId,
            graphParamsValue: paramsValue,
          });
          return;
        }
        navigate("/result", {
          state: {
            data: res.data,
            warehouseValue: value,
            projectValue,
            querySource,
            searchValue,
            templateId,
            paramsValue,
            templateParameterList,
          },
        });
      } else {
        message.error(res.message);
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
          value={projectValue}
          placeholder="Borderless"
          variant="borderless"
          suffixIcon={
            defaultStyle ? (
              <img
                src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*pwLCT6dY-6cAAAAAAAAAAAAADu3UAQ/original"
                alt=""
                className={styles["project-icon"]}
              />
            ) : (
              <img
                src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*EfbWTZEGfiIAAAAAAAAAAAAADu3UAQ/original"
                alt=""
                className={styles["project-icon"]}
              />
            )
          }
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
          popupClassName={defaultStyle ? "graph" : "warehouse"}
          dropdownStyle={{
            width: needFixed
              ? "calc(100% - 320px)"
              : defaultStyle
              ? "400px"
              : "650px",
          }}
          placeholder={placeholderValue}
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
