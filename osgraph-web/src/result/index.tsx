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
import { getExecuteShareQueryTemplate } from "../services/result";
import { getIsMobile } from "../utils/isMobile";
import styles from "./index.module.less";
import { GRAPH_STYLE } from "./style";
import { graphDataTranslator } from "./translator";

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
    isLoading: false
  });
  const { locationState, isOpen, isLoading, shareLink } = state;

  const {
    data,
    warehouseValue,
    projectValue,
    querySource,
    searchValue,
    templateId,
    templateParameterList
  } = locationState || {};
  const query = new URLSearchParams(location.search);
  const shareId = query.get("shareId");
  const shareParams = query.get("shareParams");
  const isShare = query.get("shareParams");
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
  useEffect(() => {
    if (shareId && shareParams) {
      getExecuteShareQueryTemplate(shareId, shareParams).then((res) => {
        setState((draft) => {
          draft.locationState.data = graphDataTranslator(res);
        });
      });
    }
  }, [shareId, shareParams]);
  useEffect(() => {
    console.log(location.state);
    if (location.state) {
      setState((draft) => {
        draft.locationState = location.state;
        draft.shareLink = `${window.location.origin}/result?shareId=${
          location.state.templateId
        }&shareParams=${location.state.paramsValue}&isShare=${true}`;
      });
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
                onSearch={(data: any) => {
                  const { graphTemplateId, graphParamsValue, searchData } =
                    data;
                  setState((draft) => {
                    draft.locationState.data = searchData;
                    draft.shareLink = `${
                      window.location.origin
                    }/result?shareId=${graphTemplateId}&shareParams=${graphParamsValue}&isShare=${true}`;
                  });
                }}
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
          <div className="graph">
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
            width: 432,
            height: 40,
            lineHeight: "40px",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <p
            style={{
              width: "calc(100% - 65px)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {shareLink}
          </p>
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
