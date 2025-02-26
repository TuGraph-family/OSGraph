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
  GRAPH_DOCUMENT_TITLE_MAP,
  MAX_INVALID_TIME,
} from "../constants/index";
import { GRAPH_RENDER_MODEL } from "../constants/graph";
import { getUrlParams } from "../utils";
import LayoutSelect from "../components/layout-select";
import ExtendParams from "../components/extend-params";
import { getExecuteShareLinkQuery } from "../services/result_new";
import moment from "moment";
import { DOWNLOAD_ICON, SHARE_ICON } from "../constants/links";
import { ITemplateParameterItem } from "../interfaces";

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
  const location = useLocation();
  const isMobile = getIsMobile();
  const navigate = useNavigate();


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

  const [queryList, setQueryList] = useState<any[]>([]);


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
    window?.Tracert?.call('click', "a4378.b118751.c400429.d533734")
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
    window?.Tracert?.call('click', "a4378.b118751.c400429.d533733")
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
      const { warehouseName, path } = shareInfo;
      const searchPath = window.location.search
        ? window.location.search + "&"
        : "?";
      const host = window.location.origin;
      const search = shareInfo?.templateParameterList?.map((item: ITemplateParameterItem) => {
        const { parameterValue, parameterName } = item
        return `${parameterName}=${parameterValue}`
      })?.join('&')

      draft.shareLink = `${host}/graphs/${path}/github/${warehouseName}${searchPath + search
        }`;
      draft.pngShareLink = `${host}/png/graphs/${path}/github/${warehouseName}${searchPath + search}`;
    });
  };

  const currentTemplate = useMemo(() => {
    const currentTemplate = templateId ? queryList?.find(item => item.id === templateId) : queryList[0]
    return {
      templateParameterList: currentTemplate?.templateParameterList || [],
      path: currentTemplate?.path || ''
    }
  }, [templateId, queryList]);


  useEffect(() => {
    setHistoryStatus({ undo: true, redo: true })
  }, [templateId])

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



  useEffect(() => {
    const startTime = moment().valueOf();
    let invalidTimes: number = 0
    let departureTime: number | null = null
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        departureTime = moment().valueOf();
      } else if (document.visibilityState === 'visible') {
        if (departureTime) {
          if ((moment().valueOf() - departureTime) > MAX_INVALID_TIME) {
            invalidTimes += moment().valueOf() - departureTime
          }
          departureTime = null
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const unload = () => {
      const residence_time = moment().valueOf() - startTime - invalidTimes;
      if (residence_time > 1000) {
        window?.Tracert?.call?.("set", {
          spmAPos: 'a4378',
          spmBPos: 'b118751',
          pathName: "结果页"
        });
        const isSharePage = location.pathname.includes("/graphs") &&
          location.pathname.includes("/github") ? true : false
        window?.Tracert?.call?.("logPv", { residence_time, isSharePage });
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', unload);
    }

    window.addEventListener('beforeunload', unload);

    return unload
  }, [])

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



  const onUpdateTemplateId = (templateId: number) => {
    setState((draft) => {
      draft.locationState = {
        ...locationState,
        templateId,
      };
    });
  };

  useEffect(() => {
    if (!isShare) {
      window.Tracert?.call?.('expo', 'a4378.b118751.c400429', '');
    }
  }, [])
  const getEmbedCode = (url: string) => {
    if (isRealTimeOpen) {
      return `## OSGraph
![OSGraph Chart](${url})`;
    }
    return `<iframe style="width:100%;height:auto;min-width:600px;min-height:400px;" src="${url}" frameBorder="0"></iframe>`;
  };

  const onReport = () => {
    const spmD = isRealTimeOpen ? 'd533736' : 'd533735'
    window?.Tracert?.call('click', `a4378.b118751.c400429.${spmD}`)
  }

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
                graphQuerySource={querySource}
                graphSearchValue={searchValue}
                graphTemplateId={templateId}
                graphParameterList={templateParameterList}
                onSearch={(data: any) => generateShareLink(data)}
                getGraphLoading={getGraphLoading}
                graphExtendParams={extendParams}
                onUpdateTemplateId={onUpdateTemplateId}
                spmD="b118751.c400429.d535123"
                getQueryList={(queryList) => setQueryList(queryList)}
              />
              <ExtendParams
                templateId={templateId}
                path={currentTemplate.path}
                templateParameterList={currentTemplate.templateParameterList}
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
                <img src={DOWNLOAD_ICON} alt="" className={styles['button-icon']} />JSON
              </button>
              <button onClick={download}>
                <img src={DOWNLOAD_ICON} alt="" className={styles['button-icon']} />{t("graph.download_png")}
              </button>
              <button
                onClick={() => {
                  setState((draft) => {
                    draft.isShareOpen = true;
                  });
                }}
              >
                <img src={SHARE_ICON} alt="" className={styles['button-icon']} />{t("graph.link")}
              </button>
              <button
                onClick={() => {
                  setState((draft) => {
                    draft.isRealTimeOpen = true;
                  });
                }}
              >
                <img src={SHARE_ICON} alt="" className={styles['button-icon']} />{t("graph.real_time")}
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
              queryList={queryList}
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
            <img src={SHARE_ICON} alt="" className={styles['button-icon']} />
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
              <Button type="primary" onClick={onReport}>{t`copy`}</Button>
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
              <Button type="primary" onClick={onReport}>{t`copy`}</Button>
            </CopyToClipboard>
          </div>
        </div>
      </Modal>
    </OSGraph>
  );
};
