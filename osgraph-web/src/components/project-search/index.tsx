import { ConfigProvider, Empty, Select, message, theme } from "antd";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import { graphDataTranslator } from "../../result/translator";
import { TranslatorTemplateList } from "./translator/transTemplateList";
import * as homePageNew from "../../services/homePage_new";
import styles from "./index.module.less";
import { useTranslation } from "react-i18next";
import { getPlaceholder } from "../../constants/data";

let getExecuteFullTextQuery: (...args: any[]) => Promise<any> =
  homePageNew.getExecuteFullTextQuery;
let getExecuteQueryTemplate: (...args: any[]) => Promise<any> =
  homePageNew.getExecuteQueryTemplate;
let getListQueryTemplate: (...args: any[]) => Promise<any> =
  homePageNew.getListQueryTemplate;

export const ProjectSearch: React.FC<{
  needFixed: boolean;
  debounceTimeout?: number;
  graphWarehouseValue?: string | null;
  graphQuerySource?: string;
  graphSearchValue?: string;
  graphTemplateId?: string;
  graphParameterList?: any[];
  defaultStyle?: boolean;
  onSearch?: (searchData: any) => void;
  templateIndex?: number | any;
  getGraphLoading?: (loading: boolean) => void;
  graphExtendParams?: Record<string, any>;
  onUpdateTemplateId?: (templateId: number) => void;
  spmD: string;
  getQueryList?: (queryList: any) => void;
}> = ({
  needFixed,
  debounceTimeout = 300,
  defaultStyle,
  onSearch,
  templateIndex,
  graphWarehouseValue,
  graphQuerySource,
  graphSearchValue,
  graphTemplateId,
  graphParameterList,
  getGraphLoading,
  graphExtendParams,
  onUpdateTemplateId,
  spmD,
  getQueryList,
}) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [queryList, setQueryList] = useState<any[]>([]);
    const [state, setState] = useImmer<{
      querySource: string;
      templateParameterList: any[];
      textQuery: any[];
      warehouseValue?: string;
      templateId: string | undefined;
      searchValue: string;
      loadingProjects: boolean;
    }>({
      querySource: graphQuerySource || "github_repo",
      templateParameterList: graphParameterList || [],
      textQuery: [],
      templateId: graphTemplateId,
      searchValue: "",
      loadingProjects: false,
    });
    const {
      querySource,
      templateParameterList,
      textQuery,
      warehouseValue,
      templateId,
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


    const dropdownWidth = useMemo(() => {
      switch (true) {
        case needFixed:
          return "calc(100% - 320px)";
        case defaultStyle && i18n.language !== "en":
          return "400px";
        case defaultStyle && i18n.language === "en":
          return "485px";
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
      onUpdateTemplateId?.(item.data.id);
      if (
        value &&
        querySource !== item.data.input_types
      ) {
        setState((draft) => {
          draft.warehouseValue = undefined;
          draft.textQuery = [];
        });
      } else {
        handelWarehouseChange(warehouseValue, {
          templateId: value,
          templateParameterList: item.data.templateParameterList,
        });
      }
      setState((draft) => {
        draft.querySource = item.data.input_types;
        draft.templateParameterList = item.data.templateParameterList;
        draft.templateId = value;
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
      templateInfo: { templateId: string | undefined; templateParameterList: any[] },
      isCall = true
    ) => {
      if (!value) return;
      if (isCall) {
        window?.Tracert?.call?.("click", `a4378.${spmD}`, {
          keyword: value
        }
        );
      }

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

      const path = queryList?.find(item => item.id === templateId)?.path


      const basicParams = {

        querySource,
        searchValue,
        templateId,
        paramsValue,
        templateParameterList,
        warehouseValue: value,
        warehouseName: textQueryMap[value],
        path,
        ...getTempPropsObj(templateList),
      };


      if (!defaultStyle) {
        navigate(`/graphs${window.location.search}`, {
          state: {
            ...basicParams,
            homeLoading: true,
          }
        });
      }



      getExecuteQueryTemplate({
        path,
        value: value,
        templateParameterList: templateList,
      })
        .then((res) => {
          if (!res.data) {
            message.error(res.message);
          }
          const graphData = graphDataTranslator(res.data);
          getGraphLoading?.(false);



          if (res?.success) {
            if (defaultStyle) {
              onSearch?.({
                ...basicParams,
                data: graphData,
                searchData: graphData,
                graphTemplateId: templateId,
                graphParamsValue: paramsValue,
              });
              return;
            }
            navigate(`/graphs${window.location.search}`, {
              state: {
                data: graphData,
                ...basicParams,
              },
            });

          } else {
            message.error(res?.message);
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
        getQueryList?.(queryList)
        if (!templateId) {
          setState((draft) => {
            draft.templateId = graphTemplateId ?? queryList[0].id;
          });
        }
        const contributeTemplate = queryList.find(
          (item) => item.id === templateId
        );
        if (contributeTemplate) {
          setState((draft) => {
            draft.templateParameterList =
              contributeTemplate.templateParameterList;
          });
        }
      }
    }, [queryList, templateId]);

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
      if (typeof templateIndex === "number" && queryList?.length) {
        setState((draft) => {
          const { input_types, id } = queryList[templateIndex] || {};
          draft.textQuery = [];
          draft.querySource = input_types;
          draft.templateId = id;
        });
      }
    }, [templateIndex]);

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
        }, false);
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
            value={templateId}
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
                  value={item.id}
                  key={item.id}
                  data={item}
                >
                  {item.name}
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
            placeholder={getPlaceholder(t)[querySource]}
            optionFilterProp="children"
            variant="borderless"
            onSearch={handelWarehouseSearch}
            onChange={(value) =>
              handelWarehouseChange(value, { templateId, templateParameterList })
            }
            value={warehouseValue}
            loading={loadingProjects}
            filterOption={false}
            notFoundContent={
              !textQuery?.length ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<p style={{ fontSize: 16 }}>{t("home.noData")}</p>} />
              ) : null
            }
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
