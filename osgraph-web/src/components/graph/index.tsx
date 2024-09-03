// @ts-nocheck
import type { DataID } from "@antv/g6";
import { Graph, GraphEvent } from "@antv/g6";
import { Button, message, Space } from "antd";
import { isEmpty, isEqual, isFunction } from "lodash";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactDOM from "react-dom/client";
import { useTranslation } from "react-i18next";
import {
  EDGE_DISPLAY_NAME_MAP,
  NODE_TYPE_COLOR_MAP,
  NODE_TYPE_ICON_MAP,
  NODE_TYPE_MAP,
  NODE_TYPE_SHOW_GITHUB_LINK_MAP
} from "../../constants";
import { IconFont, iconLoader } from "../icon-font";

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
            alignItems: "center"
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
      const elementInfo = record[0];
      const { nodeType } = elementInfo;
      const showGitHubLink = NODE_TYPE_SHOW_GITHUB_LINK_MAP[nodeType];
      const properties = record[0]?.properties;
      const tooltip = document.getElementsByClassName("tooltip")[0];
      tooltip.style = "border-radius:16px !important";
      tooltip.style = `opacity:${isEmpty(properties) ? 0 : 1} !important`;
      const nodeId = record[0]?.id;
      const isNode = Boolean(record[0]?.nodeType);
      const outDiv = document.createElement("div");

      outDiv.style.padding = "6px";
      const container = ReactDOM.createRoot(outDiv);

      /** result 页与分享页需要做区分展示 */
      const isShareRouter = window.location.href.includes("shareId");

      container.render(
        <>
          <Space direction="vertical">
            {isNode && renderTooltipItem("ID", nodeId)}
            {
              Object.keys(properties)
                // 过滤没有信息的属性
                .filter(item => properties[item] !== undefined && properties[item] !== null)
                .map((item) =>
                  renderTooltipItem(item, properties[item]
                )
              )
            }
          </Space>
          {!isShareRouter && properties?.name && showGitHubLink && (
            <a
              href={`https://github.com/${properties?.name}`}
              target="_blank"
              style={{ padding: "10px 10px 4px 0", display: "block" }}
            >
              前往 Github 查看
            </a>
          )}
        </>
      );

      return outDiv;
    };

    /** 自适应窗口 - 抽取出来定义，方便卸载 */
    const handleAfterLayout = () => {
      graphRef?.current?.fitView();
    };

    /** 过滤孤立节点，和不存在节点的边 */
    const filterGraphData = (data: GraphData): GraphData => {

      if (!data || !Array.isArray(data?.nodes) || !Array.isArray(data?.edges)) {
        return {nodes: [], edge: []};
      }

      const nodeSet = new Set(data.nodes.map(node => node.id));
      const validEdges = data.edges.filter(edge => nodeSet.has(edge.source) && nodeSet.has(edge.target));
    
      // 更新边集合后，重新创建新的节点集合，确保每个节点在新的边集合中被使用
      const connectedNodeSet = new Set<string>();
      validEdges.forEach(edge => {
        connectedNodeSet.add(edge.source);
        connectedNodeSet.add(edge.target);
      });
    
      // 过滤掉不在边集合中的节点
      const validNodes = data.nodes.filter(node => connectedNodeSet.has(node.id));
    
      // 返回过滤后的数据
      return {
        nodes: validNodes,
        edges: validEdges
      };
    };

    const renderGraph = () => {
      const { clientHeight: height, clientWidth: width } = containerRef.current;
      const graph = new Graph({
        container: containerRef.current as HTMLDivElement,
        data: filterGraphData(data),
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
            iconFontSize: (d) => d.iconFontSize
          }
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
            labelFontSize: 10
          }
        },
        layout: {
          type: "force",
          linkDistance: 240
        },
        behaviors: [
          { type: "click-element", multiple: false },
          { type: "zoom-canvas", sensitivity: 0.1 },
          "drag-canvas",
          "drag-element",
          "click-selected",
          "hover-element"
        ],
        autoResize: true,
        zoomRange: [0.1, 5],
        transforms: [
          {
            type: "process-parallel-edges",
            distance: 20
          }
        ],
        autoFit: "center",
        plugins: [
          {
            type: "tooltip",
            key: "tooltip",
            trigger: "click",
            enable: true,
            enterable: true,
            getContent: (_, record: Record<string, any>) =>
              getTooltipContent(record)
          }
        ]
      });
      graph.render();
      graphRef.current = graph;

      graph.on(GraphEvent.AFTER_LAYOUT, handleAfterLayout);

      if (isFunction(onReady)) onReady(graph);
    };
    React.useEffect(() => {
      if (!isEmpty(data?.nodes) || !isEmpty(data?.edges)) {
        if (!containerRef.current) return;
        renderGraph();
        return () => {
          if (graphRef.current) {
            graphRef.current.off(GraphEvent.AFTER_LAYOUT, handleAfterLayout);
            graphRef.current.destroy();
          }
        };
      }
    }, [containerRef.current, data]);

    return (
      <div ref={containerRef} style={{ height: "100%", background: "#fff" }} />
    );
  },
  (pre: IProps, next: IProps) => {
    return isEqual(pre.data, next.data);
  }
);
