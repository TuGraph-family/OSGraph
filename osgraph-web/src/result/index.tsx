/** @jsxImportSource @emotion/react */
import { Graph } from "@antv/g6";
import { Button, Modal, Spin, message, Divider, Input } from "antd";
import {
  UndoOutlined,
  RedoOutlined
} from "@ant-design/icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import { GraphView, ProjectSearch } from "../components";
import PageNotFound from "../404";
import { OSGraph } from "../controller";
import { getExecuteShareQueryTemplate } from "../services/result";

import { getIsMobile } from "../utils/isMobile";
import styles from "./index.module.less";
import { GRAPH_STYLE } from "./style";
import { graphDataTranslator } from "./translator";
import { graphTranslator } from "./translator/graph";
import {
  GRAPH_SHARE_LINK_MAP,
  GRAPH_TEMPLATE_ENUM,
  GRAPH_DOCUMENT_TITLE_MAP,
  GRAPH_EXTEND_PARAMS_MAP,
  GRAPH_TEMPLATE_TYPE_MAP,
} from "../constants/index";
import { GRAPH_RENDER_MODEL } from "../constants/graph";
import { getUrlParams } from "../utils";
import { SPAPOS } from "../constants/log";
import { timestampToDate } from '../utils/date';
import LayoutSelect from "../components/layout-select";
import ExtendParams from "../components/extend-params";
import { getExecuteShareLinkQuery } from "../services/result_new";
import share from '../assets/share.svg'
import downloadIcon from '../assets/download.svg'

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
  const location = useLocation();
  const isMobile = getIsMobile();
  const navigate = useNavigate();

  window?.Tracert?.call?.("set", {
    spmAPos: SPAPOS,
    spmBPos: location.pathname,
    pathName: "结果页"
  });
  window?.Tracert?.call?.("logPv");

  const powerByRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<{
    redo?: () => void;
    undo?: () => void;
  }>({});

  const [state, setState] = useImmer<{
    locationState: Record<string, any>;
    isShareOpen: boolean;
    isRealTimeOpen: boolean;
    shareLink: string;
    pngShareLink: string;
    isLoading: boolean;
    isErrorShareParams: boolean;
    renderMode: string;
    extendParams: Record<string, any>;
  }>(() => {
    /** Used to initialize rendering mode */
    const initializeRenderMode: () => string = () => {
      const params = new URLSearchParams(location.search);
      const renderMode = params.get("render-mode");

      if (renderMode === "3D") {
        return GRAPH_RENDER_MODEL["3D"];
      } else {
        return GRAPH_RENDER_MODEL["2D"];
      }
    };

    return {
      locationState: location || {},
      isShareOpen: false,
      isRealTimeOpen: false,
      shareLink: "",
      pngShareLink: "",
      isLoading: false,
      isErrorShareParams: false,
      renderMode: initializeRenderMode(),
      extendParams: {},
    };
  });

  const [historyStatus, setHistoryStatus] = useState<{
    undo: boolean;
    redo: boolean;
  }>({ undo: true, redo: true });

  const {
    locationState,
    isShareOpen,
    isRealTimeOpen,
    isLoading,
    shareLink,
    extendParams,
    pngShareLink,
  } = state;

  const {
    data,
    warehouseValue,
    projectValue,
    querySource,
    searchValue,
    templateId,
    templateParameterList,
  } = locationState || {};
  const query = new URLSearchParams(location.search);
  const shareId = query.get("shareId");
  const shareParams = query.get("shareParams");
  const isShare =
    query.get("shareParams") ||
    (location.pathname.includes("/graphs") &&
      location.pathname.includes("/github"));
  const { t, i18n } = useTranslation();
  const lang = getUrlParams("lang") || "zh-CN";
  const graphRef = React.useRef<Graph>();

  const download = async () => {
    if (!graphRef.current) return;
    const dataURL = await graphRef.current.toDataURL({ mode: "viewport" });
    const [head, content] = dataURL.split(",");
    const contentType = head.match(/:(.*?);/)![1];

    const bstr = atob(content);
    let length = bstr.length;
    const u8arr = new Uint8Array(length);

    while (length--) {
      u8arr[length] = bstr.charCodeAt(length);
    }

    const blob = new Blob([u8arr], { type: contentType });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = warehouseValue || "os graph";
    a.click();
  };

  const onFilterrData = (graphData: Record<string, any>) => {

    const newNodes = graphData?.nodes?.map((nodeItem: Record<string, any>) => {
      const { comment, id, name, nodeType, source } = nodeItem;

      return { comment, id, name, nodeType, source };
    }) || []
    const newEdges = graphData?.edges?.map((nodeItem: Record<string, any>) => {
      const { comment, count, direction, edgeType, id, name, name_en, source, target, weight } = nodeItem;

      return { comment, count, direction, edgeType, id, name, name_en, source, target, weight };
    }) || []
    return {
      ...graphData,
      nodes: newNodes,
      edges: newEdges
    };
  };

  const downloadJSON = () => {
    if (!graphRef.current) return;
    const graphData = graphRef.current.getData();

    const blob = new Blob([JSON.stringify(onFilterrData(graphData), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = warehouseValue || "os graph";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const getGraphLoading = (loading: boolean) => {
    setState((draft) => {
      draft.isLoading = loading;
    });
  };

  useEffect(() => {
    i18n.changeLanguage(lang === "en-US" ? "en" : "zh");
  }, []);

  const generateShareLink = (shareInfo: Record<string, any>) => {
    setState((draft) => {
      draft.locationState = shareInfo;
      const { templateId, warehouseName } = shareInfo;
      const projectValueFormat =
        GRAPH_TEMPLATE_TYPE_MAP[GRAPH_SHARE_LINK_MAP[templateId]];
      const searchPath = window.location.search
        ? window.location.search + "&"
        : "?";
      const host = window.location.origin;

      /** repo contribute */
      if (templateId === GRAPH_TEMPLATE_ENUM.REPO_CONTRIBUTE) {
        /** translator start time and end time of query */
        const startTime = timestampToDate(shareInfo["start-time"]);
        const endTime = timestampToDate(shareInfo["end-time"]);
        const search = `repo-limit=${shareInfo?.["repo-limit"]}&start-time=${startTime}&end-time=${endTime}`;
        draft.shareLink = `${host}/graphs/${projectValueFormat}/github/${warehouseName}${searchPath + search
          }`;
        draft.pngShareLink = `${host}/png/graphs/${GRAPH_TEMPLATE_TYPE_MAP[GRAPH_SHARE_LINK_MAP[templateId]]
          }/github/${warehouseName}${searchPath + search}`;
      } else if (templateId === GRAPH_TEMPLATE_ENUM.REPO_ECOLOGY) {
        /** repo ecology */
        draft.shareLink = `${host}/graphs/${projectValueFormat}/github/${warehouseName}${searchPath}repo-limit=${shareInfo?.["repo-limit"]}`;
        draft.pngShareLink = `${host}/png/graphs/${GRAPH_TEMPLATE_TYPE_MAP[GRAPH_SHARE_LINK_MAP[templateId]]
          }/github/${warehouseName}${searchPath}repo-limit=${shareInfo?.["repo-limit"]
          }`;
      } else if (templateId === GRAPH_TEMPLATE_ENUM.REPO_COMMUNITY) {
        const search = `country-limit=${shareInfo["country-limit"]}&company-limit=${shareInfo["company-limit"]}&user-limit=${shareInfo["user-limit"]}`;
        /** repo community */
        draft.shareLink = `${host}/graphs/${projectValueFormat}/github/${warehouseName}${searchPath + search
          }`;
        draft.pngShareLink = `${host}/png/graphs/${GRAPH_TEMPLATE_TYPE_MAP[GRAPH_SHARE_LINK_MAP[templateId]]
          }/github/${warehouseName}${searchPath + search}`;
      } else if (templateId === GRAPH_TEMPLATE_ENUM.ACCT_ACTIVITY) {
        /** acct activity */
        draft.shareLink = `${host}/graphs/${projectValueFormat}/github/${warehouseName}${searchPath}user-limit=${shareInfo?.["user-limit"]}`;
        draft.pngShareLink = `${host}/png/graphs/${GRAPH_TEMPLATE_TYPE_MAP[GRAPH_SHARE_LINK_MAP[templateId]]
          }/github/${warehouseName}${searchPath}user-limit=${shareInfo?.["user-limit"]
          }`;
      } else if (templateId === GRAPH_TEMPLATE_ENUM.ACCT_PARTNER) {
        /** acct partner */
        draft.shareLink = `${host}/graphs/${projectValueFormat}/github/${warehouseName}${searchPath}user-limit=${shareInfo?.["user-limit"]}`;
        draft.pngShareLink = `${host}/png/graphs/${GRAPH_TEMPLATE_TYPE_MAP[GRAPH_SHARE_LINK_MAP[templateId]]
          }/github/${warehouseName}${searchPath}user-limit=${shareInfo?.["user-limit"]
          }`;
      } else if (templateId === GRAPH_TEMPLATE_ENUM.ACCT_INTEREST) {
        const search = `repo-limit=${shareInfo["repo-limit"]}&topic-limit=${shareInfo["topic-limit"]}`;
        /** acct interest */
        draft.shareLink = `${host}/graphs/${projectValueFormat}/github/${warehouseName}${searchPath + search
          }`;
        draft.pngShareLink = `${host}/png/graphs/${GRAPH_TEMPLATE_TYPE_MAP[GRAPH_SHARE_LINK_MAP[templateId]]
          }/github/${warehouseName}${searchPath + search}`;
      }
    });
  };

  /**
   * share logic
   * Need to adapt the share links for both the new and old versions.
   */
  useEffect(() => {
    /** 1. old version */
    if (shareId && shareParams) {
      getExecuteShareQueryTemplate(shareId, shareParams).then((res) => {
        setState((draft) => {
          draft.locationState.data = graphDataTranslator(res);
        });
      });
    }

    /** 2. new version */
    if (
      location.pathname.includes("/graphs") &&
      location.pathname.includes("/github")
    ) {
      getExecuteShareLinkQuery(graphTranslator())
        .then((res) => {
          setState((draft) => {
            draft.locationState.data = graphDataTranslator(res);
          });
        })
        .catch(() => {
          setState((draft) => {
            draft.isErrorShareParams = true;
          });
        });
    }
  }, [shareId, shareParams]);

  /** Homepage jump injects State query logic */
  useEffect(() => {
    if (location.state) {
      generateShareLink(location.state);
    }
  }, [location.state]);

  /** according to diff router to set document.title */
  useEffect(() => {
    const pattern = /^\/graphs\/([^\/]+)\/github\/(\S+)/;
    const match = location.pathname.match(pattern);

    if (match && match[0]) {
      document.title = GRAPH_DOCUMENT_TITLE_MAP[match[1]] || "OSGraph";
    }
  }, [location.pathname]);

  useEffect(() => {
    const resizePowerBy = () => {
      if (powerByRef.current) {
        powerByRef.current.style.transform = `scale(${Math.min(
          Math.max(window.innerWidth / 1000, 0.5),
          1
        )})`;
        powerByRef.current.style.transformOrigin = "100% 100%";
      }
    };
    resizePowerBy();
  }, [powerByRef.current]);

  if (state.isErrorShareParams) {
    return <PageNotFound source="error" />;
  }

  const goBack = () => {
    const lang = getUrlParams("lang");
    if (lang) {
      navigate(`/?lang=${lang}`);
    } else {
      navigate("/");
    }
  };

  const graphExtendParams = useMemo(() => {
    let newParams: Record<string, any> = {};
    Object.keys(extendParams)?.forEach((key) => {
      newParams[
        GRAPH_EXTEND_PARAMS_MAP[GRAPH_SHARE_LINK_MAP[templateId] + key]
      ] = extendParams[key];
    });
    return newParams;
  }, [extendParams]);

  const onUpdateTemplateId = (templateId: number) => {
    setState((draft) => {
      draft.locationState = {
        ...locationState,
        templateId,
      };
    });
  };

  const getEmbedCode = (url: string) => {
    if (isRealTimeOpen) {
      return `## OSGraph
![OSGraph Chart](${url})`;
    }
    return `<iframe style="width:100%;height:auto;min-width:600px;min-height:400px;" src="${url}" frameBorder="0"></iframe>`;
  };

  return (
    <OSGraph>
      <div
        className={isMobile ? styles["mobile-result"] : "graph-container"}
        css={GRAPH_STYLE}
      >
        {!isShare && (
          <div className="header">
            <div className="sel">
              <img
                src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*9HFERrqAg58AAAAAAAAAAAAADu3UAQ/original"
                alt=""
                onClick={goBack}
                style={{ cursor: "pointer" }}
              />

              <ProjectSearch
                needFixed={false}
                defaultStyle={true}
                graphWarehouseValue={warehouseValue}
                graphProjectValue={projectValue}
                graphQuerySource={querySource}
                graphSearchValue={searchValue}
                graphTemplateId={templateId}
                graphParameterList={templateParameterList}
                onSearch={(data: any) => generateShareLink(data)}
                getGraphLoading={getGraphLoading}
                graphExtendParams={graphExtendParams}
                onUpdateTemplateId={onUpdateTemplateId}
              />
              <ExtendParams
                templateId={templateId}
                onChangeParams={(data: any) =>
                  setState((draft) => {
                    draft.extendParams = data;
                  })
                }
              />
              <div style={{ display: "flex" }}>
                <span onClick={() => historyRef.current?.undo?.()}>
                  <Button
                    style={{ width: "auto" }}
                    disabled={historyStatus.undo}
                  >
                    <UndoOutlined />
                    {t("historyAction.undo")}
                  </Button>
                </span>
                <span onClick={() => historyRef.current?.redo?.()}>
                  <Button
                    style={{ width: "auto" }}
                    disabled={historyStatus.redo}
                  >
                    <RedoOutlined />
                    {t("historyAction.redo")}
                  </Button>
                </span>
              </div>
              <LayoutSelect
                setLayout={() => {
                  graphRef.current?.layout();
                }}
              />
            </div>
            <div className="control">
              {/* <Select
                options={[
                  {value: GRAPH_RENDER_MODEL['2D'], label: GRAPH_RENDER_MODEL['2D']},
                  {value: GRAPH_RENDER_MODEL['3D'], label: GRAPH_RENDER_MODEL['3D']}
                ]}
                value={state.renderMode}
                onChange={(value: string) => {
                  setState((draft: any) => {
                    draft.renderMode = value;
                    if (draft.shareLink) {
                      const renderModeParams = value === GRAPH_RENDER_MODEL['3D'] ? '&render-mode=3D' : '';
                      draft.shareLink = draft.shareLink + renderModeParams;
                    }
                  });
                }}
              /> */}
              <button onClick={downloadJSON}>
                <img src={downloadIcon} alt="" className={styles['button-icon']} />JSON
              </button>
              <button onClick={download}>
                <img src={downloadIcon} alt="" className={styles['button-icon']} />{t("graph.download_png")}
              </button>
              <button
                onClick={() => {
                  setState((draft) => {
                    draft.isShareOpen = true;
                  });
                }}
              >
                <img src={share} alt="" className={styles['button-icon']} />{t("graph.link")}
              </button>
              <button
                onClick={() => {
                  setState((draft) => {
                    draft.isRealTimeOpen = true;
                  });
                }}
              >
                <img src={share} alt="" className={styles['button-icon']} />{t("graph.real_time")}
              </button>
            </div>
          </div>
        )}
        <Spin spinning={isLoading}>
          {/* There is no search bar on the sharing page, and the height of the canvas needs to be differentiated */}
          <div className={`${isShare ? "graph-share" : "graph"}`}>
            <GraphView
              data={data}
              key={state.renderMode}
              renderMode={state.renderMode}
              renderTemplate={templateId}
              onReady={(graph) => (graphRef.current = graph)}
              setHistoryStatus={setHistoryStatus}
              ref={historyRef}
            />
          </div>
        </Spin>
        {/* watermark */}
        <div className={styles["graph-waterfall"]} ref={powerByRef}>
          <div
            className={styles["os-graph"]}
            onClick={() => window.open("/")}
          />
          <Divider plain className={styles["power-by-divide"]}>
            Powered by
          </Divider>
          <div className={styles["power-by"]}>
            <div
              className={styles["tugraph"]}
              onClick={() => window.open("https://www.tugraph.tech/")}
            />
            <div
              className={styles["antv"]}
              onClick={() => window.open("https://antv.antgroup.com/")}
            />
            <div
              className={styles["xlab"]}
              onClick={() =>
                window.open("https://github.com/X-lab2017?language=shell")
              }
            />
          </div>
        </div>
      </div>

      <Modal
        title={
          <div className={styles.shareItemTitle}>
            <img src={share} alt="" className={styles['button-icon']} />
            {isRealTimeOpen ? t`graph.real_time` : t`graph.link`}
          </div>
        }
        width={800}
        open={isShareOpen || isRealTimeOpen}
        footer={null}
        onCancel={() => {
          setState((draft) => {
            draft.isShareOpen = false;
            draft.isRealTimeOpen = false;
          });
        }}
      >
        <div className={styles.shareItem}>
          <div className={styles.shareItemLabel}>
            {isRealTimeOpen ? t`graph.real_time_link` : t`graph.share_link`}：
          </div>
          <div className={styles.shareItemContent}>
            <Input.TextArea
              value={isRealTimeOpen ? pngShareLink : shareLink}
              autoSize={{ maxRows: 3, minRows: 3 }}
              className={styles.shareItemVal}
            />
            <CopyToClipboard
              text={isRealTimeOpen ? pngShareLink : shareLink}
              onCopy={(_, result) => {
                if (result) {
                  message.success(t`copySuccess`);
                } else {
                  message.error("复制失败，请稍后再试");
                }
              }}
            >
              <Button type="primary">{t`copy`}</Button>
            </CopyToClipboard>
          </div>
        </div>
        <div className={styles.shareItem}>
          <div className={styles.shareItemLabel}>
            {isRealTimeOpen
              ? t`graph.real_time_code`
              : t`graph.share_link_code`}
            ：
          </div>
          <div className={styles.shareItemContent}>
            <Input.TextArea
              value={getEmbedCode(isRealTimeOpen ? pngShareLink : shareLink)}
              autoSize={{ maxRows: 3, minRows: 3 }}
              className={styles.shareItemVal}
            />
            <CopyToClipboard
              text={getEmbedCode(isRealTimeOpen ? pngShareLink : shareLink)}
              onCopy={(_, result) => {
                if (result) {
                  message.success(t`copySuccess`);
                } else {
                  message.error("复制失败，请稍后再试");
                }
              }}
            >
              <Button type="primary">{t`copy`}</Button>
            </CopyToClipboard>
          </div>
        </div>
      </Modal>
    </OSGraph>
  );
};
