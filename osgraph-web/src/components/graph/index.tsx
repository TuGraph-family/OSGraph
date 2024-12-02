// @ts-nocheck
import type { DataID } from "@antv/g6";
import { Graph, GraphEvent } from "@antv/g6";
import { isEmpty, isEqual, isFunction } from "lodash";
import React, { useRef, useMemo } from "react";
import ForceGraph3D, { ForceGraph3DInstance } from '3d-force-graph';
import { useTranslation } from "react-i18next";
import { formatGraph3DData, generateLinkText, updateLinkPosition, generateNodeThreeObject, focusNodePositionForClick, calcTooltipPos } from '../../utils/graph3D';
import { getTooltipContent } from '../../utils/toolTip';
import {
  EDGE_DISPLAY_NAME_MAP,
  NODE_TYPE_COLOR_MAP,
  NODE_TYPE_ICON_MAP,
  NODE_TYPE_MAP,
} from "../../constants";
import { GRAPH_RENDER_MODEL } from '../../constants/graph';
import { iconLoader } from "../icon-font";
import { filterGraphDataTranslator } from './translator/filterGraphData';
import { GRAPH_TEMPLATE_ENUM } from '../../constants/index';

interface IProps {
  data: DataID;
  onReady?: (graph: Graph) => void;
  renderMode?: GRAPH_RENDER_MODEL['2D'] | GRAPH_RENDER_MODEL['3D'];
  renderTemplate?: GRAPH_TEMPLATE_ENUM;
}

/** 检测 tooltip status */
let showToolTipObj = {
  isHoverToolTip: false,
  isHoverNode: false
}

export const GraphView = React.memo(
  ({ data, renderMode, renderTemplate, onReady }: IProps) => {
    const containerRef = React.useRef(null);
    const graphRef = React.useRef<Graph>(null);
    const selectEdges = useRef<string[]>([]);

    const yValue = useMemo(() => {
      return [GRAPH_TEMPLATE_ENUM.REPO_ECOLOGY, GRAPH_TEMPLATE_ENUM.REPO_COMMUNITY].includes(renderTemplate) ? 300 : 170;
    }, [renderTemplate]);

    /** 自适应窗口 - 抽取出来定义，方便卸载 */
    const handleAfterLayout = () => {
      graphRef?.current?.fitView();
    };

    const renderGraph = () => {
      const { clientHeight: height, clientWidth: width } = containerRef.current;
      const graph = new Graph({
        container: containerRef.current as HTMLDivElement,
        data: filterGraphDataTranslator(data),
        width,
        height,
        node: {
          style: {
            size: (d) => d.size,
            labelText: (d) => d?.properties?.name,
            fill: (d) => {
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

    const render3DGraph = () => {
      /**  数据深拷贝，且把 edges 映射到 links上 */
      const graph3DData = formatGraph3DData(data);
      const highlightNodes = new Set();
      const highlightLinks = new Set();
      let nodeMaterials = new Map();
      let hoverNode: any = null;

      /** 高亮 node 和 link */
      const updateHighlight = (graph: ForceGraph3DInstance) => {
        if (graph) {
          graph
            .nodeColor(graph.nodeColor())
            .linkWidth(graph.linkWidth())
            .linkDirectionalParticles(graph.linkDirectionalParticles())
        }
      };

      /** 检测字体是否加载完 */
      const isFontLoaded = async (fontName) => {
        if ('fonts' in document) {
          try {
            await document.fonts.load(`16px ${fontName}`);
            return document.fonts.check(`16px ${fontName}`);
          } catch (error) {
            console.error('Error loading font:', error);
            return false;
          }
        }
        return false;
      };

      const graph = ForceGraph3D()(containerRef.current)
      graphRef.current = graph;
      graph.cameraPosition({ x: 0, y: 0, z: yValue })
        .nodeOpacity(0.6)
        .linkThreeObjectExtend(true)
        .linkCurvature('curvature')
        .linkCurveRotation('rotation')
        .linkWidth(0.4)
        .linkDirectionalParticleSpeed(0.01)
        .linkCurvature(0.1)
        .linkDirectionalArrowLength(1.5)
        .linkDirectionalArrowRelPos(0.9)
        .linkDirectionalParticleWidth(1)
        .linkDirectionalArrowColor(link => link.source.color)
        .linkDirectionalParticles(link =>
          highlightLinks.has(link) || selectEdges.current.includes(link.id) ? 1.5 : 0
        )
        .linkWidth(link =>
          highlightLinks.has(link) || selectEdges.current.includes(link.id) ? 1.5 : 0.2
        )
        .linkThreeObject(link => generateLinkText(link))
        .linkPositionUpdate((sprite, options) => updateLinkPosition(sprite, options))
        .onLinkHover((link: any) => {
          if (highlightLinks.has(link)) return;
          highlightNodes.clear();
          highlightLinks.clear();
          if (link) {
            highlightLinks.add(link);
            highlightNodes.add(link.source);
            highlightNodes.add(link.target);
          }
          updateHighlight();
        })
        .onNodeClick(node => focusNodePositionForClick(graph, node))
        .onNodeDragEnd(node => {
          node.fx = node.x;
          node.fy = node.y;
          node.fz = node.z;
        })
        .onNodeHover((node) => {
          if (
            (!node && !highlightNodes.size) ||
            (node && node === hoverNode) ||
            (node && !node.neighbors)
          ) {
            return;
          }

          highlightNodes.clear();
          highlightLinks.clear();
          if (node && node.neighbors) {
            highlightNodes.add(node);
            node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
            node.links.forEach((link: any) => highlightLinks.add(link));
          }

          hoverNode = node || null;
          nodeMaterials.forEach((material, node) => {
            highlightNodes.has(node)
              ? material?.color.set('yellow')
              : material?.color.set(material?.nodeColor);
          });
          updateHighlight(graph);

          if (node) {
            const screenCoords = calcTooltipPos(graph, node);
            tooltip.style.top = `${screenCoords.y}px`;
            tooltip.style.left = `${screenCoords.x + 30}px`;
            const tooltipContent = getTooltipContent([node]);
            tooltip.innerHTML = '';
            tooltip.appendChild(tooltipContent);
            tooltip.style.display = 'block';
            showToolTipObj.isHoverNode = true;
          } else {
            setTimeout(() => {
              if (!showToolTipObj.isHoverToolTip) {
                tooltip.style.display = 'none';
              }
            }, 100);
            showToolTipObj.isHoverNode = false;
          }
        })
        .graphData(graph3DData)
        
        /** 等图标加载完毕后，再构建 nodeThree 自定义节点 */
        isFontLoaded('os-iconfont').then(isLoaded => {
          if (isLoaded) {
            graph.nodeThreeObject((node) => generateNodeThreeObject(nodeMaterials, node));
            graph.d3Force('charge').strength(-160);
          } else {
            console.log('Font is not loaded');
          }
        });
    };

    React.useEffect(() => {
      if (!isEmpty(data?.nodes) || !isEmpty(data?.edges)) {
        if (!containerRef.current) return;
        renderMode === GRAPH_RENDER_MODEL['2D']
          ? renderGraph()
          : render3DGraph();

        const handleMouseEnter = () => {
          tooltip.style.display = 'block';
          showToolTipObj.isHoverToolTip = true;
        };
        const handleMouseLeave = () => {
          if (!showToolTipObj.isHoverNode) {
            tooltip.style.display = 'none';
          }
          showToolTipObj.isHoverToolTip = false;
        };

        tooltip?.addEventListener('mouseenter', handleMouseEnter);
        tooltip?.addEventListener('mouseleave', handleMouseLeave);
        
        return () => {

          tooltip?.removeEventListener('mouseenter', handleMouseEnter);
          tooltip?.removeEventListener('mouseleave', handleMouseLeave);

          if (graphRef.current) {
            if (typeof graphRef.current?.off === 'function') {
              graphRef.current?.off(GraphEvent.AFTER_LAYOUT, handleAfterLayout);
              graphRef.current?.destroy();
            }
            graphRef.current = null;
          }
        };
      }
    }, [containerRef.current, data, renderMode]);

    const tooltipStyle: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      color: '#000',
      padding: '5px',
      borderRadius: '5px',
      display: 'none',
      pointerEvents: 'auto',
      zIndex: 99
    };

    return (
      <>
        <div ref={containerRef} style={{ height: "100%", background: "#fff" }} />
        <div id="tooltip" style={tooltipStyle} />
      </>
    );
  },
  (pre: IProps, next: IProps) => {
    return isEqual(pre.data, next.data) && isEqual(pre?.renderMode, next?.renderMode);
  }
);
