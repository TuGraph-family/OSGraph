import { ConfigProvider, Select, message, theme } from "antd";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import { GRAPH_TYPE_CLUSTER } from "../../constants";
import { graphDataTranslator } from "../../result/translator";
import { TranslatorTemplateList } from "./translator/transTemplateList";
import {
  getExecuteFullTextQuery,
  getExecuteQueryTemplate,
  getListQueryTemplate,
} from "../../services/homePage";
import styles from "./index.module.less";
import { useTranslation } from "react-i18next";
import { GET_TEMPLATE, getPlaceholder } from "../../constants/data";

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
  graphExtendParams?: Record<string, any>;
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
  getGraphLoading,
  graphExtendParams,
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [queryList, setQueryList] = useState<any[]>([]);
  const [state, setState] = useImmer<{
    querySource: string;
    templateParameterList: any[];
    textQuery: any[];
    warehouseValue?: string;
    templateId: string;
    projectValue: string;
    searchValue: string;
    loadingProjects: boolean;
  }>({
    querySource: graphQuerySource || "github_repo",
    templateParameterList: graphParameterList || [],
    textQuery: [],
    templateId: graphTemplateId || "1",
    projectValue: "REPO_CONTRIBUTE",
    searchValue: "",
    loadingProjects: false,
  });
  const {
    querySource,
    templateParameterList,
    textQuery,
    warehouseValue,
    templateId,
    projectValue,
    searchValue,
    loadingProjects,
  } = state;

  /** handle the map relationship of query */
  const textQueryMap = useMemo(() => {
    if (textQuery.length > 0) {
      const queryMap: Record<number, string> = {};
      textQuery.forEach((item) => {
        queryMap[item.id] = item.name;
      });
      return queryMap;
    }
    return {};
  }, [textQuery]);

  useEffect(() => {
    if (graphProjectValue) {
      setState((draft) => {
        draft.projectValue = graphProjectValue;
      });
    }
  }, [graphProjectValue]);

  const dropdownWidth = useMemo(() => {
    switch (true) {
      case needFixed:
        return "calc(100% - 320px)";
      case defaultStyle && i18n.language !== "en":
        return "400px";
      case defaultStyle && i18n.language === "en":
        return "520px";
      case i18n.language === "en":
        return "770px";
      default:
        return "650px";
    }
  }, [needFixed, defaultStyle, i18n.language]);

  const styleObj: React.CSSProperties = {
    width: dropdownWidth,
    position: needFixed ? "fixed" : "relative",
    top: needFixed ? 24 : 0,
    height: defaultStyle ? 32 : 56,
    marginLeft: defaultStyle ? 16 : 0,
    border: defaultStyle ? "1px solid #f2f2f2" : "1px solid #ffffff",
    background: defaultStyle ? "#ffffff" : "",
    borderRadius: defaultStyle ? "6px" : "12px",
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
        templateParameterList: item.data.templateParameterList,
      });
    }
    setState((draft) => {
      draft.querySource = item.data.querySource;
      draft.templateParameterList = item.data.templateParameterList;
      draft.templateId = item.data.id;
      draft.projectValue = value;
    });
  };

  const getExecuteFullTextQueryList = (indexName: string, keyword: string) => {
    setState((draft) => {
      draft.loadingProjects = true;
      draft.querySource = indexName;
    });
    getExecuteFullTextQuery({ indexName, keyword }).then((res) => {
      setState((draft) => {
        draft.textQuery = res;
        draft.searchValue = keyword;
        draft.loadingProjects = false;
      });
    });
  };

  /** get template properties object */
  const getTempPropsObj = (templateList: any[]) => {
    if (!Array.isArray(templateList)) {
      throw new TypeError("type error, please check params");
    }

    const properties: Record<string, string | number> = {};
    templateList.forEach((item) => {
      properties[item.parameterName] = item.parameterValue;
    });

    return properties;
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
    if (!value) return;
    const { templateId, templateParameterList } = templateInfo;

    setState((draft) => {
      draft.warehouseValue = value;
    });
    const templateList = TranslatorTemplateList(templateParameterList, value);
    const paramsValue = templateList
      ?.map((item: { parameterValue: string }) => {
        return item.parameterValue;
      })
      .join(",");

    getGraphLoading?.(true);
    getExecuteQueryTemplate({
      templateId: templateId,
      templateParameterList: templateList,
    })
      .then((res) => {
        if (!res.data) {
          message.error(res.message);
        }
        const graphData = graphDataTranslator(res.data);
        getGraphLoading?.(false);

        const basicParams = {
          data: graphData,
          projectValue,
          querySource,
          searchValue,
          templateId,
          paramsValue,
          templateParameterList,
          warehouseValue: value,
          warehouseName: textQueryMap[value],
          ...getTempPropsObj(templateList),
        };

        if (res?.success) {
          if (defaultStyle) {
            onSearch?.({
              ...basicParams,
              searchData: graphData,
              graphTemplateId: templateId,
              graphParamsValue: paramsValue,
            });
            return;
          }
          navigate(`/graphs${window.location.search}`, {
            state: {
              ...basicParams,
            },
          });
        } else {
          message.error(res.message);
        }
      })
      .finally(() => {
        getGraphLoading?.(false);
      });
  };

  useEffect(() => {
    setState((draft) => {
      draft.warehouseValue = graphWarehouseValue || undefined;
    });
  }, [graphWarehouseValue]);

  useEffect(() => {
    if (queryList.length) {
      const contributeTemplate = queryList.find(
        (item) => item.templateType === projectValue
      );
      if (contributeTemplate) {
        setState((draft) => {
          draft.templateId = contributeTemplate.id;
          draft.templateParameterList =
            contributeTemplate.templateParameterList;
        });
      }
    }
  }, [queryList, projectValue]);

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
        draft.querySource =
          GRAPH_TYPE_CLUSTER[templateType as keyof typeof GRAPH_TYPE_CLUSTER];
        draft.textQuery = [];
      });
    }
  }, [templateType]);

  useEffect(() => {
    if (graphExtendParams) {
      const newTemplateParameterList = templateParameterList.map((item) => {
        if (graphExtendParams[item.parameterName]) {
          return {
            ...item,
            parameterValue: String(graphExtendParams[item.parameterName]),
          };
        }
        return item;
      });
      setState((draft) => {
        draft.templateParameterList = newTemplateParameterList;
      });
      handelWarehouseChange(warehouseValue, {
        templateId: templateId,
        templateParameterList: newTemplateParameterList,
      });
    }
  }, [graphExtendParams]);

  return (
    <div
      className={[
        styles["project-search"],
        i18n.language === "en" ? styles["project-search-en"] : "",
      ].join(" ")}
      style={styleObj}
    >
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
                {GET_TEMPLATE(t)[item.templateType]}
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
            width: dropdownWidth,
            lineHeight: 32,
          }}
          placeholder={getPlaceholder(t)[projectValue]}
          optionFilterProp="children"
          variant="borderless"
          onSearch={handelWarehouseSearch}
          onChange={(value) =>
            handelWarehouseChange(value, { templateId, templateParameterList })
          }
          value={warehouseValue}
          loading={loadingProjects}
          filterOption={false}
        >
          {textQuery?.map((item) => {
            return (
              <Select.Option value={item.id} key={item.id}>
                <div style={{ lineHeight: "32px" }}>{item.name}</div>
              </Select.Option>
            );
          })}
        </Select>
      </ConfigProvider>
    </div>
  );
};
