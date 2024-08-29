/** @jsxImportSource @emotion/react */
import { Graph } from "@antv/g6";
import { Button, Modal, Spin, message } from "antd";
import React, { useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import { GraphView, ProjectSearch } from "../components";
import { OSGraph } from "../controller";
import { getExecuteShareQueryTemplate, getExecuteShareLinkQuery } from "../services/result";
import { getIsMobile } from "../utils/isMobile";
import styles from "./index.module.less";
import { GRAPH_STYLE } from "./style";
import { graphDataTranslator } from "./translator";
import { graphTranslator } from './translator/graph';
import { GRAPH_SHARE_LINK_MAP, GRAPH_TYPE_MAP } from '../constants/index';
import { timestampToDate } from '../utils/date';

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
  const location = useLocation();
  const isMobile = getIsMobile();
  const navigate = useNavigate();

  const [state, setState] = useImmer<{
    locationState: Record<string, any>;
    isOpen: boolean;
    shareLink: string;
    isLoading: boolean;
  }>({
    locationState: location || {},
    isOpen: false,
    shareLink: "",
    isLoading: false,
  });
  const { locationState, isOpen, isLoading, shareLink } = state;

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
  const isShare = query.get("shareParams") || location.pathname.includes('/graphs') && location.pathname.includes('/github');
  const { t } = useTranslation();
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
  const getGraphLoading = (loading: boolean) => {
    setState((draft) => {
      draft.isLoading = loading;
    });
  };

  const generateShareLink = (shareInfo: Record<string, any>) => {
    
    setState((draft) => {

      draft.locationState = shareInfo;
      const { projectValue, warehouseName } = shareInfo;
      const projectValueFormat = GRAPH_SHARE_LINK_MAP[projectValue];

      /** repo contribute */
      if (projectValue === GRAPH_TYPE_MAP.REPO_CONTRIBUTE) {
        const { top_n } = shareInfo;
        const start_timestamp = timestampToDate(shareInfo?.start_timestamp);
        const end_timestamp = timestampToDate(shareInfo?.end_timestamp);
        draft.shareLink = `${window.location.origin}/graphs/${projectValueFormat}/github/${warehouseName}?start=${start_timestamp}&end=${end_timestamp}&contrib-limit=${top_n}`;
      }

      /** repo ecology */
      else if (projectValue === GRAPH_TYPE_MAP.REPO_ECOLOGY) {
        const { top_n } = shareInfo;
        draft.shareLink = `${window.location.origin}/graphs/${projectValueFormat}/github/${warehouseName}?repo-limit=${top_n}`;
      }

      /** repo community */
      else if (projectValue === GRAPH_TYPE_MAP.REPO_COMMUNITY) {
        const { country_topn, company_topn, developer_topn } = shareInfo;
        draft.shareLink = `${window.location.origin}/graphs/${projectValueFormat}/github/${warehouseName}?country-limit=${country_topn}&org-limit=${company_topn}&contrib-limit=${developer_topn}`;
      }

      /** acct activity */
      else if (projectValue === GRAPH_TYPE_MAP.ACCT_ACTIVITY) {
        const { top_n } = shareInfo;
        draft.shareLink = `${window.location.origin}/graphs/${projectValueFormat}/github/${warehouseName}?repo-limit=${top_n}`;
      }

      /** acct partner */
      else if (projectValue === GRAPH_TYPE_MAP.ACCT_PARTNER) {
        const { top_n } = shareInfo;
        draft.shareLink = `${window.location.origin}/graphs/${projectValueFormat}/github/${warehouseName}?friend-limit=${top_n}`;
      }

      /** acct interest */
      else if (projectValue === GRAPH_TYPE_MAP.ACCT_INTEREST) {
        const { repo_topn, topic_topn } = shareInfo;
        draft.shareLink = `${window.location.origin}/graphs/${projectValueFormat}/github/${warehouseName}?repo-limit=${repo_topn}&topic-limit=${topic_topn}`;
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
    if (location.pathname.includes('/graphs') && location.pathname.includes('/github')) {
      getExecuteShareLinkQuery(graphTranslator())
        .then((res) => {
          setState((draft) => {
            draft.locationState.data = graphDataTranslator(res);
          });
        });
    }
  }, [shareId, shareParams]);

  /** 主页跳转注入 State 的查询逻辑 */
  useEffect(() => {
    if (location.state) {
      generateShareLink(location.state);
    }
  }, [location.state]);

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
                onClick={() => navigate("/")}
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
              />
            </div>
            <div className="control">
              <button
                onClick={() => {
                  setState((draft) => {
                    draft.isOpen = true;
                  });
                }}
              >{t`share`}</button>
              <button onClick={download}>{t`download`}</button>
            </div>
          </div>
        )}
        <Spin spinning={isLoading}>
          {/* 分享页没有搜索栏，画布高度需要区分 */}
          <div className={`${isShare ? 'graph-share' : 'graph'}`}>
            <GraphView
              data={data}
              onReady={(graph) => (graphRef.current = graph)}
            />
          </div>
        </Spin>
      </div>
      <Modal
        title={t`share`}
        open={isOpen}
        footer={null}
        onCancel={() => {
          setState((draft) => {
            draft.isOpen = false;
          });
        }}
      >
        <div
          style={{
            background: "#f6f6f6",
            borderRadius: 8,
            padding: "0 8px",
            width: 432,
            height: 40,
            lineHeight: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              marginRight: 8,
              width: "calc(100% - 65px)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {shareLink}
          </div>
          <CopyToClipboard
            text={shareLink}
            onCopy={(_, result) => {
              if (result) {
                message.success(t`copy success`);
              } else {
                message.error("复制失败，请稍后再试");
              }
            }}
          >
            <Button type="primary">{t`copy`}</Button>
          </CopyToClipboard>
        </div>
      </Modal>
    </OSGraph>
  );
};
