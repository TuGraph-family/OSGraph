// @ts-nocheck
import type { GraphData, NodeData } from "@antv/g6";
import { Graph, GraphEvent, CanvasEvent, HistoryEvent } from "@antv/g6";
import { Spin } from "antd";
import { isEmpty, isEqual, isFunction } from "lodash";
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import ForceGraph3D, { ForceGraph3DInstance } from "3d-force-graph";
import { useTranslation } from "react-i18next";
import {
  formatGraph3DData,
  generateLinkText,
  updateLinkPosition,
  generateNodeThreeObject,
  focusNodePositionForClick,
  calcTooltipPos,
} from "../../utils/graph3D";
import { getTooltipContent } from "../../utils/toolTip";
import { isFontLoaded } from "../../utils/isFontLoaded";
import {
  NODE_TYPE_COLOR_MAP,
  NODE_TYPE_ICON_MAP,
  NODE_TYPE_MAP,
} from "../../constants";
import { GRAPH_RENDER_MODEL } from "../../constants/graph";
import { iconLoader } from "../icon-font";
import { filterGraphDataTranslator } from "./translator/filterGraphData";
import { removeExistElement } from "./translator/removeExistElement";
import { GRAPH_TEMPLATE_ENUM } from "../../constants/index";
import { getExecuteShareLinkQuery } from "../../services/result";
import { graphDataTranslator } from "../../result/translator";
import { GET_EDGE_DISPLAY_NAME_MAP } from "../../constants/data";
import ReactDOM from "react-dom";
import LayouSelect from "../layout-select";
import GraphMenuItem from "../graph-menu-item";
import { createRoot } from "react-dom/client";

interface IProps {
  data: GraphData;
  setHistoryStatus: React.Dispatch<
    React.SetStateAction<{
      undo: boolean;
      redo: boolean;
    }>
  >;
  onReady?: (graph: Graph) => void;
  renderMode?: GRAPH_RENDER_MODEL["2D"] | GRAPH_RENDER_MODEL["3D"];
  renderTemplate?: GRAPH_TEMPLATE_ENUM;
}

/** 检测 tooltip status */
let showToolTipObj = {
  isHoverToolTip: false,
  isHoverNode: false,
};

export const GraphView = React.memo(
  forwardRef(
    (
      { data, renderMode, renderTemplate, setHistoryStatus, onReady }: IProps,
      ref
    ) => {
      const containerRef = React.useRef(null);
      const graphRef = React.useRef<Graph>(null);
      const selectEdges = useRef<string[]>([]);
      const graphDataMapForID = useRef<Record<string, NodeData>>({});
      const [isCanvasLoading, setIsCanvasLoading] = useState<boolean>(false);
      const isShare =
        location.pathname.includes("/graphs") &&
        location.pathname.includes("/github");

      const redoAndUndo = (action: "redo" | "undo") => {
        if (graphRef.current) {
          const history = graphRef.current.getPluginInstance("history");

          if (action === "redo" && history.canRedo()) {
            history.redo();
          }

          if (action === "undo" && history.canUndo()) {
            history.undo();
          }
        }
      };

      useImperativeHandle(ref, () => ({
        redo: () => redoAndUndo("redo"),
        undo: () => redoAndUndo("undo"),
      }));

      const yValue = useMemo(() => {
        return [
          GRAPH_TEMPLATE_ENUM.REPO_ECOLOGY,
          GRAPH_TEMPLATE_ENUM.REPO_COMMUNITY,
        ].includes(renderTemplate)
          ? 300
          : 170;
      }, [renderTemplate]);

      const { t } = useTranslation();

      /** 自适应窗口 - 抽取出来定义，方便卸载 */
      const handleAfterLayout = () => {
        graphRef?.current?.fitView();
      };

      /** update function for x, y of node */
      const updateGraphDataMapXY = (graph: Graph) => {
        const nodeData = graph.getNodeData();
        for (let node of nodeData) {
          graphDataMapForID.current[node.id] = node;
        }
      };

      const updateDataXY = (nodeDataTODO: GraphData) => {
        const finishNodeData = nodeDataTODO.nodes.map((node) => {
          return graphDataMapForID.current[node.id];
        });
        return {
          nodes: finishNodeData,
          edges: nodeDataTODO.edges,
        };
      };

      const renderGraph = () => {
        const { clientHeight: height, clientWidth: width } =
          containerRef.current;
        const graph = new Graph({
          container: containerRef.current as HTMLDivElement,
          data: filterGraphDataTranslator(data),
          width,
          height,
          animation: false,
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
              iconFontSize: (d) => d.iconFontSize,
            },
          },
          edge: {
            style: {
              labelText: (d) => {
                const { displayName, hasCount } =
                  GET_EDGE_DISPLAY_NAME_MAP(t)[d?.edgeType];
                return ` ${displayName}${
                  hasCount ? "：" + (d?.properties?.count || 0) + " " : ""
                }`;
              },
              endArrow: (d) =>
                GET_EDGE_DISPLAY_NAME_MAP(t)[d?.edgeType].hasArrow,
              labelBackgroundFill: "#fff",
              labelBackground: true,
              stroke: (d) =>
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
            linkDistance: 300,
            preventOverlap: true,
            minMovement: 0.05,
          },
          behaviors: [
            "zoom-canvas",
            {
              key: "drag-canvas",
              type: "drag-canvas",
            },
            "drag-element",
            "click-select",
            {
              type: "hover-activate",
              degree: 1,
            },
            // {
            //   type: 'auto-adapt-label',
            //   enable: true,
            //   padding: 0,
            // },
          ],
          autoResize: true,
          zoomRange: [0.1, 5],
          transforms: [
            {
              type: "process-parallel-edges",
              distance: 30,
            },
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
                getTooltipContent(record, t),
            },
            {
              type: "history",
              key: "history",
            },
            {
              type: "contextmenu",
              trigger: "contextmenu",
              onClick: (value) => {
                const queryParams = value.split("&");
                setIsCanvasLoading(true);
                getExecuteShareLinkQuery({
                  templateType: queryParams[0],
                  path: queryParams[1],
                  extendsStr:
                    queryParams[0] === "repo_contribute"
                      ? "start_timestamp=1416650305&end_timestamp=1732269505"
                      : "",
                }).then(async (res) => {
                  if (graphRef.current) {
                    const translatorData = graphDataTranslator(res);

                    /** 寻找需要 addData 的 diff 节点 */
                    const graphData = graph.getData();
                    const formatData = removeExistElement(
                      graphData,
                      translatorData
                    );

                    const extendId = queryParams[2];
                    const extendData = graphRef.current?.getNodeData(extendId);

                    /** addData 中需要 init 节点样式, 并设置扩展节点的初始坐标 */
                    graphRef.current.addData({
                      nodes: formatData?.nodes?.map((node) => ({
                        ...node,
                        style: extendData?.style,
                      })),
                      edges: formatData.edges,
                    });

                    /** 扩展的点是否需要更新样式，比如 nodeSize */
                    if (formatData.nodes.length > 1) {
                      const updateNodeData = translatorData.nodes.find(
                        (node) => {
                          return node.id === extendId;
                        }
                      );
                      graphRef.current.updateNodeData([updateNodeData]);
                    }

                    /** 更新节点大小 */
                    const mergeData = graphRef.current.getData();
                    graphRef.current.updateData(graphDataTranslator(mergeData));
                    await graphRef.current.render();
                    setIsCanvasLoading(false);
                    setHistoryStatus({ undo: false, redo: true });
                    const history =
                      graphRef.current?.getPluginInstance("history");
                    history.redoStack = [];
                    updateGraphDataMapXY(graphRef.current);
                  }
                });
              },
              getContent: (event) => {
                const id = event.target.id;
                const data = graphRef.current?.getNodeData(id);
                const { properties } = data;

                const onClick = (templateType, extendsStr) => {
                  setIsCanvasLoading(true);
                  getExecuteShareLinkQuery({
                    templateType,
                    path: properties.name,
                    extendsStr,
                  }).then(async (res) => {
                    if (graphRef.current) {
                      const translatorData = graphDataTranslator(res);

                      /** 寻找需要 addData 的 diff 节点 */
                      const graphData = graph.getData();
                      const formatData = removeExistElement(
                        graphData,
                        translatorData
                      );

                      const extendId = id;
                      const extendData =
                        graphRef.current?.getNodeData(extendId);

                      /** addData 中需要 init 节点样式, 并设置扩展节点的初始坐标 */
                      graphRef.current.addData({
                        nodes: formatData?.nodes?.map((node) => ({
                          ...node,
                          style: extendData?.style,
                        })),
                        edges: formatData.edges,
                      });

                      /** 扩展的点是否需要更新样式，比如 nodeSize */
                      if (formatData.nodes.length > 1) {
                        const updateNodeData = translatorData.nodes.find(
                          (node) => {
                            return node.id === extendId;
                          }
                        );
                        graphRef.current.updateNodeData([updateNodeData]);
                      }

                      /** 更新节点大小 */
                      const mergeData = graphRef.current.getData();
                      graphRef.current.updateData(
                        graphDataTranslator(mergeData)
                      );
                      await graphRef.current.render();
                      setIsCanvasLoading(false);
                      setHistoryStatus({ undo: false, redo: true });
                      const history =
                        graphRef.current?.getPluginInstance("history");
                      history.redoStack = [];
                      updateGraphDataMapXY(graphRef.current);
                    }
                  });
                };

                const getMenuItems = (type: string) => {
                  if (isShare) return;

                  if (type === NODE_TYPE_MAP.github_repo) {
                    return [
                      {
                        name: t("template.REPO_CONTRIBUTE"),
                        templateType: "repo_contribute",
                        key: "1",
                      },
                      {
                        name: t("template.REPO_ECOLOGY"),
                        templateType: "repo_ecology",
                        key: "2",
                      },
                      {
                        name: t("template.REPO_COMMUNITY"),
                        templateType: "repo_community",
                        key: "3",
                      },
                    ];
                  } else if (type === NODE_TYPE_MAP.github_user) {
                    return [
                      {
                        name: t("template.ACCT_ACTIVITY"),
                        templateType: "acct_activity",
                        key: "4",
                      },
                      {
                        name: t("template.ACCT_PARTNER"),
                        templateType: "acct_partner",
                        key: "5",
                      },
                      {
                        name: t("template.ACCT_INTEREST"),
                        templateType: "acct_interest",
                        key: "6",
                      },
                    ];
                  }
                  return [];
                };
                const menuList = getMenuItems(data.nodeType);
                const mountNode = document.createElement("div");
                const root = createRoot(mountNode);
                root.render(
                  <ul className="g6-contextmenu-ul">
                    {getMenuItems(data.nodeType)?.map((item) => (
                      <GraphMenuItem
                        key={item.key}
                        title={item.name}
                        templateId={item.key}
                        onSearch={(params: string) =>
                          onClick(item.templateType, params)
                        }
                      />
                    ))}
                  </ul>
                );
                return mountNode;
              },

              enable: (e) => e.targetType === "node",
            },
          ],
        });

        const formatUndoStack = (stack) => {
          if (stack.length <= 0) {
            return [];
          }

          const stackValue = stack[stack.length - 1];

          if (Object.values(stackValue?.current?.add ?? {}).length === 0) {
            stack.pop();
            formatUndoStack(stack);
          } else {
            return stack;
          }
        };

        /** icon-font 加载完毕后再执行渲染，否则会闪烁一下 */
        isFontLoaded("os-iconfont").then((isLoaded) => {
          if (isLoaded) {
            graph.render().then(async () => {
              const history = graphRef.current?.getPluginInstance("history");
              updateGraphDataMapXY(graphRef.current);
              history.on(HistoryEvent.ADD, (event) => {
                formatUndoStack(history.undoStack);
              });
              history.on(HistoryEvent.REDO, async (event) => {
                const finishNodeData = updateDataXY(
                  history.undoStack[history.undoStack.length - 1]?.original
                    ?.remove
                );
                graphRef.current?.updateData(finishNodeData);
                await graphRef.current.draw();
                setHistoryStatus({
                  undo: false,
                  redo: history.redoStack?.length < 1,
                });
              });
              history.on(HistoryEvent.UNDO, () => {
                setHistoryStatus({
                  undo: history.undoStack?.length <= 1,
                  redo: false,
                });
              });
            });
          }
        });
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
              .linkDirectionalParticles(graph.linkDirectionalParticles());
          }
        };

        const graph = ForceGraph3D()(containerRef.current);
        graphRef.current = graph;
        graph
          .cameraPosition({ x: 0, y: 0, z: yValue })
          .nodeOpacity(0.6)
          .linkThreeObjectExtend(true)
          .linkCurvature("curvature")
          .linkCurveRotation("rotation")
          .linkWidth(0.4)
          .linkDirectionalParticleSpeed(0.01)
          .linkCurvature(0.1)
          .linkDirectionalArrowLength(1.5)
          .linkDirectionalArrowRelPos(0.9)
          .linkDirectionalParticleWidth(1)
          .linkDirectionalArrowColor((link) => link.source.color)
          .linkDirectionalParticles((link) =>
            highlightLinks.has(link) || selectEdges.current.includes(link.id)
              ? 1.5
              : 0
          )
          .linkWidth((link) =>
            highlightLinks.has(link) || selectEdges.current.includes(link.id)
              ? 1.5
              : 0.2
          )
          .linkThreeObject((link) => generateLinkText(link, t))
          .linkPositionUpdate((sprite, options) =>
            updateLinkPosition(sprite, options)
          )
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
          .onNodeClick((node) => focusNodePositionForClick(graph, node))
          .onNodeDragEnd((node) => {
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
              node.neighbors.forEach((neighbor) =>
                highlightNodes.add(neighbor)
              );
              node.links.forEach((link: any) => highlightLinks.add(link));
            }

            hoverNode = node || null;
            nodeMaterials.forEach((material, node) => {
              highlightNodes.has(node)
                ? material?.color.set("yellow")
                : material?.color.set(material?.nodeColor);
            });
            updateHighlight(graph);

            if (node) {
              const screenCoords = calcTooltipPos(graph, node);
              tooltip.style.top = `${screenCoords.y}px`;
              tooltip.style.left = `${screenCoords.x + 30}px`;
              const tooltipContent = getTooltipContent([node], t);
              tooltip.innerHTML = "";
              tooltip.appendChild(tooltipContent);
              tooltip.style.display = "block";
              showToolTipObj.isHoverNode = true;
            } else {
              setTimeout(() => {
                if (!showToolTipObj.isHoverToolTip) {
                  tooltip.style.display = "none";
                }
              }, 100);
              showToolTipObj.isHoverNode = false;
            }
          })
          .graphData(graph3DData);

        /** 等图标加载完毕后，再构建 nodeThree 自定义节点 */
        isFontLoaded("os-iconfont").then((isLoaded) => {
          if (isLoaded) {
            graph.nodeThreeObject((node) =>
              generateNodeThreeObject(nodeMaterials, node)
            );
            graph.d3Force("charge").strength(-160);
          } else {
            console.log("Font is not loaded");
          }
        });
      };

      useEffect(() => {
        if (!isEmpty(data?.nodes) || !isEmpty(data?.edges)) {
          if (!containerRef.current) return;
          renderMode === GRAPH_RENDER_MODEL["2D"]
            ? renderGraph()
            : render3DGraph();

          const handleMouseEnter = () => {
            tooltip.style.display = "block";
            showToolTipObj.isHoverToolTip = true;
          };
          const handleMouseLeave = () => {
            if (!showToolTipObj.isHoverNode) {
              tooltip.style.display = "none";
            }
            showToolTipObj.isHoverToolTip = false;
          };

          /** 点击画布其他区域时，把 contextMenu 收起来 */
          if (graphRef.current && renderMode === GRAPH_RENDER_MODEL["2D"]) {
            graphRef?.current.on(CanvasEvent.CLICK, () => {
              const g6ContextMenuDom = document.querySelector(
                ".g6-contextmenu"
              ) as HTMLDivElement;
              if (g6ContextMenuDom) {
                g6ContextMenuDom.style.display = "none";
              }
            });
          }

          const tooltipDom = document.querySelector("#tooltip");
          tooltipDom?.addEventListener("mouseenter", handleMouseEnter);
          tooltipDom?.addEventListener("mouseleave", handleMouseLeave);

          return () => {
            tooltipDom?.removeEventListener("mouseenter", handleMouseEnter);
            tooltipDom?.removeEventListener("mouseleave", handleMouseLeave);

            if (graphRef.current) {
              if (typeof graphRef.current?.off === "function") {
                graphRef.current?.off(
                  GraphEvent.AFTER_LAYOUT,
                  handleAfterLayout
                );
                graphRef.current?.destroy();
              }
              graphRef.current = null;
            }
          };
        }
      }, [containerRef.current, data, renderMode]);

      const tooltipStyle: React.CSSProperties = {
        position: "absolute",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        color: "#000",
        padding: "5px",
        borderRadius: "5px",
        display: "none",
        pointerEvents: "auto",
        zIndex: 99,
      };

      return (
        <Spin spinning={isCanvasLoading} style={{ height: "100%" }}>
          <div
            ref={containerRef}
            style={{ height: "100%", background: "#fff" }}
          />
          <div id="tooltip" style={tooltipStyle} />
        </Spin>
      );
    }
  ),
  (pre: IProps, next: IProps) => {
    return (
      isEqual(pre.data, next.data) && isEqual(pre?.renderMode, next?.renderMode)
    );
  }
);
