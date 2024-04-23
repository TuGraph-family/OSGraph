import { ConfigProvider, Select, message, theme } from "antd";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import { GRAPH_TYPE_CLUSTER, PLACEHOLDER_MAP } from "../../constants";
import { graphDataTranslator } from "../../result/translator";
import {
  getExecuteFullTextQuery,
  getExecuteQueryTemplate,
  getListQueryTemplate
} from "../../services/homePage";
import styles from "./index.module.less";

export const ProjectSearch: React.FC<{
  needFixed: boolean;
  debounceTimeout?: number;
  graphWarehouseValue?: string | null;
  graphProjectValue?: string;
  graphQuerySource?: string;
  graphSearchValue?: string;
  graphTemplateId?: string;
  graphParameterList?: any[];
  defaultStyle?: boolean;
  onSearch?: (searchData: any) => void;
  templateType?: string | any;
  getGraphLoading?: (loading: boolean) => void;
}> = ({
  needFixed,
  debounceTimeout = 300,
  defaultStyle,
  onSearch,
  templateType,
  graphWarehouseValue,
  graphProjectValue,
  graphQuerySource,
  graphSearchValue,
  graphTemplateId,
  graphParameterList,
  getGraphLoading
}) => {
  const navigate = useNavigate();
  const [queryList, setQueryList] = useState<any[]>([]);
  const [state, setState] = useImmer<{
    querySource: string;
    templateParameterList: any[];
    textQuery: any[];
    warehouseValue: string | null;
    templateId: string;
    projectValue?: string;
    placeholderValue: string;
    searchValue: string;
    loadingProjects: boolean;
  }>({
    querySource: "github_repo",
    templateParameterList: graphParameterList || [],
    textQuery: [],
    warehouseValue: graphWarehouseValue || null,
    templateId: graphTemplateId || "1",
    projectValue: graphProjectValue || "REPO_CONTRIBUTE",
    placeholderValue: "请输入 GitHub 仓库名称",
    searchValue: "",
    loadingProjects: false
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
    loadingProjects
  } = state;

  const styleObj: React.CSSProperties = {
    width: needFixed ? "calc(100% - 320px)" : defaultStyle ? "400px" : "650px",
    position: needFixed ? "fixed" : "relative",
    top: needFixed ? 24 : 0,
    height: defaultStyle ? 32 : 56,
    marginLeft: defaultStyle ? 16 : 0,
    border: defaultStyle ? "1px solid #f2f2f2" : "1px solid #ffffff",
    background: defaultStyle ? "#ffffff" : "",
    borderRadius: defaultStyle ? "6px" : "12px"
  };

  const switchName = (parameterName: string, parameterValue: string) => {
    switch (parameterName) {
      case "start_timestamp":
        return Math.floor(
          new Date().setMonth(new Date().getMonth() - 120) / 1000
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

  const handleProjectChange = (value: string, item: any) => {
    if (
      projectValue &&
      GRAPH_TYPE_CLUSTER[projectValue as keyof typeof GRAPH_TYPE_CLUSTER] !==
        GRAPH_TYPE_CLUSTER[value as keyof typeof GRAPH_TYPE_CLUSTER]
    ) {
      setState((draft) => {
        draft.warehouseValue = undefined;
        draft.textQuery = [];
      });
    } else {
      handelWarehouseChange(warehouseValue, {
        templateId: item.data.id,
        templateParameterList: item.data.templateParameterList
      });
    }
    setState((draft) => {
      draft.querySource = item.data.querySource;
      draft.templateParameterList = item.data.templateParameterList;
      draft.templateId = item.data.id;
      draft.projectValue = value;
      draft.placeholderValue = PLACEHOLDER_MAP[value];
    });
  };

  const getExecuteFullTextQueryList = (indexName: string, keyword: string) => {
    setState((draft) => {
      draft.loadingProjects = true;
    });
    getExecuteFullTextQuery({ indexName, keyword }).then((res) => {
      setState((draft) => {
        draft.textQuery = res;
        draft.searchValue = keyword;
        draft.loadingProjects = false;
      });
    });
  };

  const handelWarehouseSearch = useMemo(() => {
    const loadOptions = (value: string) => {
      getExecuteFullTextQueryList(querySource, value);
    };
    return debounce(loadOptions, debounceTimeout);
  }, [textQuery, debounceTimeout, querySource]);

  const handelWarehouseChange = (
    value: any,
    templateInfo: { templateId: string; templateParameterList: any[] }
  ) => {
    const { templateId, templateParameterList } = templateInfo;
    setState((draft) => {
      draft.warehouseValue = value;
    });

    const templateList = handleJson(templateParameterList, value);

    const paramsValue = templateList
      ?.map((item: { parameterValue: string }) => {
        return item.parameterValue;
      })
      .join(",");

    getGraphLoading?.(true);
    getExecuteQueryTemplate({
      templateId: templateId,
      templateParameterList: templateList
    }).then((res) => {
      const graphData = graphDataTranslator(res.data);
      getGraphLoading?.(false);
      if (res?.success) {
        if (defaultStyle) {
          onSearch?.({
            searchData: graphData,
            graphTemplateId: templateId,
            graphParamsValue: paramsValue
          });
          return;
        }
        navigate("/result", {
          state: {
            data: graphData,
            projectValue,
            querySource,
            searchValue,
            templateId,
            paramsValue,
            templateParameterList,
            warehouseValue: value
          }
        });
      } else {
        message.error(res.message);
      }
    });
  };

  useEffect(() => {
    setState((draft) => {
      draft.projectValue = graphProjectValue || "REPO_CONTRIBUTE";
    });
  }, [graphProjectValue]);
  useEffect(() => {
    setState((draft) => {
      draft.warehouseValue = graphWarehouseValue || null;
    });
  }, [graphWarehouseValue]);

  useEffect(() => {
    if (queryList.length) {
      const contributeTemplate = queryList.find(
        (item) => item.templateType === "REPO_CONTRIBUTE"
      );
      if (contributeTemplate) {
        setState((draft) => {
          draft.templateId = contributeTemplate.id;
          draft.templateParameterList =
            contributeTemplate.templateParameterList;
        });
      }
    }
  }, [queryList]);

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
      setState((draft) => {
        draft.projectValue = templateType;
        draft.placeholderValue = PLACEHOLDER_MAP[templateType];
      });
    }
  }, [templateType]);

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
          value={projectValue}
          placeholder="Borderless"
          variant="borderless"
          suffixIcon={
            defaultStyle ? (
              <img
                src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*pwLCT6dY-6cAAAAAAAAAAAAADu3UAQ/original"
                alt=""
                className={[styles["project-icon"], "project-arrow"].join(" ")}
              />
            ) : (
              <img
                src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*EfbWTZEGfiIAAAAAAAAAAAAADu3UAQ/original"
                alt=""
                className={[styles["project-icon"], "project-arrow"].join(" ")}
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
              : "650px"
          }}
          placeholder={placeholderValue}
          optionFilterProp="children"
          variant="borderless"
          onSearch={handelWarehouseSearch}
          onChange={(value) =>
            handelWarehouseChange(value, { templateId, templateParameterList })
          }
          value={warehouseValue}
          loading={loadingProjects}
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
