/** @jsxImportSource @emotion/react */
import type { Graph } from "@antv/g6";
import { Modal, Button, message } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { OSGraph } from "../controller";
import { GraphView } from "../components";
import { ProjectSearch } from "../components";
import { GRAPH_STYLE } from "./style";
import { getExecuteShareQueryTemplate } from "../services/result";
import { useLocation } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
  const location = useLocation();
  const {
    data,
    warehouseValue,
    projectValue,
    querySource,
    searchValue,
    templateId,
    paramsValue,
    templateParameterList,
  } = location.state || {};
  const query = new URLSearchParams(location.search);
  const shareId = query.get("shareId");
  const shareParams = query.get("shareParams");
  const isShare = query.get("shareParams");
  const [graphData, setGraphData] = React.useState(data || {});
  const { t } = useTranslation();
  const [open, setIsOpen] = React.useState(false);
  const graphRef = React.useRef<Graph>();
  const [shareLink, setShareLink] = React.useState<string>(
    `${window.location.protocol}//${
      window.location.hostname
    }:9000/result?shareId=${templateId}&shareParams=${paramsValue}&isShare=${true}`
  );

  const download = async () => {
    if (!graphRef.current) return;
    const dataURL = await graphRef.current.toDataURL({
      type: "image/png",
      encoderOptions: 1,
    });
    let a: HTMLAnchorElement | null = document.createElement("a");
    a.download = "test.png";
    a.href = dataURL;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    a = null;
  };

  useEffect(() => {
    if (shareId && shareParams) {
      getExecuteShareQueryTemplate(shareId, shareParams).then((res) => {
        setGraphData(res);
      });
    }
  }, [shareId, shareParams]);

  return (
    <OSGraph>
      <div className="graph-container" css={GRAPH_STYLE}>
        {!isShare && (
          <div className="header">
            <div className="sel">
              <a href="/">
                <img
                  src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*9HFERrqAg58AAAAAAAAAAAAADu3UAQ/original"
                  alt=""
                />
              </a>

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
                  const { searchData, graphTemplateId, graphParamsValue } =
                    data;
                  setShareLink(
                    `${window.location.protocol}//${
                      window.location.hostname
                    }:9000/result?shareId=${graphTemplateId}&shareParams=${graphParamsValue}&isShare=${true}`
                  );
                  setGraphData(searchData);
                }}
              />
            </div>
            <div className="control">
              <button
                onClick={() => {
                  setIsOpen(true);
                }}
              >{t`share`}</button>
              <button onClick={download}>{t`download`}</button>
            </div>
          </div>
        )}

        <div className="graph">
          <GraphView
            data={graphData}
            onReady={(graph) => (graphRef.current = graph)}
          />
        </div>
      </div>
      <Modal
        title={t`share`}
        open={open}
        footer={null}
        onCancel={() => {
          setIsOpen(false);
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
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              width: "calc(100% - 65px)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
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
