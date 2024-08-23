// @ts-nocheck
import type { DataID } from "@antv/g6";
import { Graph, GraphEvent } from "@antv/g6";
import { isEmpty, isEqual, isFunction } from "lodash";
import React, { useEffect } from "react";
import {
  EDGE_DISPLAY_NAME_MAP,
  NODE_TYPE_COLOR_MAP,
  NODE_TYPE_ICON_MAP,
  NODE_TYPE_MAP,
} from "../../constants";
import { iconLoader, IconFont } from "../icon-font";
import ReactDOM from "react-dom/client";
import { Button, message, Space } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";

interface IProps {
  data: DataID;
  onReady?: (graph: Graph) => void;
}

export const GraphView = React.memo(
  ({ data, onReady }: IProps) => {
    const containerRef = React.useRef(null);
    const graphRef = React.useRef<Graph>(null);
    const { t } = useTranslation();

    const renderTooltipItem = (label: string, text: string) => {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 14, marginRight: 8 }}>
            <span>{label}</span>：<span>{text}</span>
          </div>
          <CopyToClipboard
            text={text}
            onCopy={(_, result) => {
              if (result) {
                message.success(t`copy success`);
              } else {
                message.error("复制失败，请稍后再试");
              }
            }}
          >
            <Button
              size="small"
              icon={<IconFont type="os-icon-fuzhi" />}
              type="text"
            />
          </CopyToClipboard>
        </div>
      );
    };

    const getTooltipContent = (record: Record<string, any>) => {
      const properties = record[0]?.properties;
      const tooltip = document.getElementsByClassName("tooltip")[0];
      tooltip.style = "border-radius:16px !important";
      tooltip.style = `opacity:${isEmpty(properties) ? 0 : 1} !important`;
      const nodeId = record[0]?.id;
      const isNode = Boolean(record[0]?.nodeType);
      const outDiv = document.createElement("div");

      outDiv.style.padding = "12px";
      const container = ReactDOM.createRoot(outDiv);

      /** result 页与分享页需要做区分展示 */
      const isShareRouter = window.location.href.includes('shareId');

      container.render(
        <Space direction="vertical">
          {isNode && renderTooltipItem("ID", nodeId)}
          {Object.keys(properties).map((item) =>
            renderTooltipItem(item, properties[item])
          )}
          {
            !isShareRouter
              && properties?.name
              && <a
                  href={`https://github.com/${properties?.name}`}
                  target="_blank"
                >
                  前往 Github 查看
                </a>
          }
        </Space>
      );

      return outDiv;
    };

    const renderGraph = () => {
      const { clientHeight: height, clientWidth: width } = containerRef.current;
      const graph = new Graph({
        container: containerRef.current as HTMLDivElement,
        data,
        width,
        height,
        node: {
          style: {
            size: (d) => d.size,
            labelText: (d) => d?.properties?.name,
            color: (d) => {
              return d.nodeType === NODE_TYPE_MAP.github_user
                ? NODE_TYPE_COLOR_MAP[d.nodeType][d.id % 4]
                : NODE_TYPE_COLOR_MAP[d.nodeType];
            },
            iconText: (d) => {
              return iconLoader(NODE_TYPE_ICON_MAP[d.nodeType]);
            },
            iconFontFamily: "os-iconfont",
            iconFill: "#fff",
            iconWidth: (d) => d.size,
            iconHeight: (d) => d.size,
            iconFontSize: (d) => d.iconFontSize,
          },
        },
        edge: {
          style: {
            labelText: (d) => {
              const { displayName, hasCount } =
                EDGE_DISPLAY_NAME_MAP[d?.edgeType];
              return ` ${displayName}${
                hasCount ? "：" + (d?.properties?.count || 0) + " " : ""
              }`;
            },
            endArrow: (d) => EDGE_DISPLAY_NAME_MAP[d?.edgeType].hasArrow,
            labelBackgroundFill: "#fff",
            labelBackground: true,
            color: (d) =>
              d.targetNodeType === NODE_TYPE_MAP.github_user
                ? NODE_TYPE_COLOR_MAP[d.targetNodeType][d.target % 4]
                : NODE_TYPE_COLOR_MAP[d.targetNodeType],
            labelOpacity: 1,
            lineWidth: (d) => d.lineWidth,
            endArrowSize: (d) => d.endArrowSize,
            labelFontSize: 10,
          },
        },
        layout: {
          type: "force",
          linkDistance: 240,
        },
        behaviors: [
          { type: "click-element", multiple: false },
          { type: "zoom-canvas", sensitivity: 0.1 },
          "drag-canvas",
          "drag-element",
          "click-selected",
          "hover-element",
        ],
        autoResize: true,
        zoomRange: [0.1, 5],
        transforms: [
          {
            type: "process-parallel-edges",
            distance: 20,
          },
        ],
        autoFit: 'center',
        plugins: [
          {
            type: "tooltip",
            key: "tooltip",
            trigger: "click",
            enable: true,
            enterable: true,
            getContent: (_, record: Record<string, any>) =>
              getTooltipContent(record),
          },
        ],
      });
      graph.render();
      graphRef.current = graph;

      let animationFrameId;

      /** 布局前需要时刻调整布局位置处于视图中心 */
      graph.on(GraphEvent.BEFORE_LAYOUT, () => {
        /** 这里需要先执行一次 fitCenter 函数，可以解决首次闪烁的问题 */
        graph.fitView();
        animationFrameId = requestAnimationFrame(() => {
          graph.fitView();
        })
      });

      /** 布局完成之后卸载 requestAnimationFrame 的轮询操作 */
      graph.on(GraphEvent.AFTER_LAYOUT, () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        graph.fitView();
      });

      if (isFunction(onReady)) onReady(graph);
    };
    React.useEffect(() => {
      if (!isEmpty(data?.nodes) || !isEmpty(data?.edges)) {
        if (!containerRef.current) return;
        renderGraph();
        return () => {
          if (graphRef.current) graphRef.current.destroy();
        };
      }
    }, [containerRef.current, data]);

    return (
      <div
        ref={containerRef}
        style={{ height: "100%", background: "#fff" }}
      />
    );
  },
  (pre: IProps, next: IProps) => {
    return isEqual(pre.data, next.data);
  }
);
