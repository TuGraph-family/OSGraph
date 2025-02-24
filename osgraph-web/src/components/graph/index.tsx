// @ts-nocheck
import type { GraphData, NodeData } from "@antv/g6";
import {
  Graph,
  GraphEvent,
  CanvasEvent,
  HistoryEvent,
  ExtensionCategory,
  register,
} from "@antv/g6";
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
import { getExecuteShareLinkQuery } from "../../services/result_new";
import { graphDataTranslator } from "../../result/translator";
import { GET_EDGE_DISPLAY_NAME_MAP } from "../../constants/data";
import ReactDOM from "react-dom";
import LayoutSelect from "../layout-select";
import GraphMenuItem from "../graph-menu-item";
import { createRoot } from "react-dom/client";
import MultipleSelects from "./plugin/multiple-selects";

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

/** Detection tooltip status */
let showToolTipObj = {
  isHoverToolTip: false,
  isHoverNode: false,
};

register(ExtensionCategory.BEHAVIOR, "multiple-selects", MultipleSelects);

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
            window?.Tracert?.call?.("click", 'a4378.b118751.c400429.d533732'
            );
            history.redo();
          }

          if (action === "undo" && history.canUndo()) {
            window?.Tracert?.call?.("click", 'a4378.b118751.c400429.d533731'
            );
            history.undo();
          }
        }
      };

      useEffect(() => {
        window.Tracert?.call?.('expo', 'a4378.b118751.c400430', '');
        document.addEventListener('contextmenu', (event) => {
          if (event.ctrlKey) {
            event.preventDefault();
          }
        });
      }, [])

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

      /** Adaptive window - extract the definition for easy uninstallation */
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
                return ` ${displayName}${hasCount ? "：" + (d?.properties?.count || 0) + " " : ""
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
            linkDistance: (_, source, target) => {
              if (source?.data?.size === 56 && target?.data?.size === 56) {
                return 1000;
              }
              return 300;
            },
            preventOverlap: true,
            minMovement: 0.05,
            nodeSize: 56,
          },
          behaviors: [
            "zoom-canvas",
            "drag-element",
            {
              type: "drag-canvas",
              enable: (event) => {
                return (
                  event.shiftKey === false && event.targetType === "canvas"
                );
              },
            },

            {
              type: "click-select",
              enable: (e) => {
                if (e?.metaKey || e?.ctrlKey || e.shiftKey) {
                  return false;
                }
                return true;
              },
              multiple: true,
            },
            {
              type: "hover-activate",
              degree: 1,
            },
            {
              type: "lasso-select",
              trigger: ["shift"],
            },
            "multiple-selects",
          ],
          autoResize: true,
          zoomRange: [0.1, 5],
          transforms: [
            {
              type: "process-parallel-edges",
              distance: 20,
            },
          ],
          autoFit: "center",
          plugins: [
            {
              type: "tooltip",
              key: "tooltip",
              trigger: "click",
              enable: (e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey) {
                  const tooltipElement =
                    document.getElementsByClassName("tooltip")[0];
                  if (tooltipElement) {
                    tooltipElement.style.visibility = "hidden";
                  } else {
                    console.warn("Tooltip element not found");
                  }
                }
                return !(e.metaKey || e.ctrlKey || e.shiftKey);
              },
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
              getContent: (event) => {
                const g6ContextMenuDom =
                  document.getElementsByClassName("g6-contextmenu")[0];
                if (g6ContextMenuDom) {
                  g6ContextMenuDom.style.overflow = "visible";
                }
                const id = event.target.id;
                const data = graphRef.current?.getNodeData(id);
                const { properties } = data;
                const onClick = (templateType, extendsStr) => {
                  setIsCanvasLoading(true);
                  getExecuteShareLinkQuery({
                    templateType,
                    path: properties.name,
                    extendsStr,
                  })
                    .then(async (res) => {
                      if (graphRef.current) {
                        const translatorData = graphDataTranslator(res);

                        /** Find diff nodes that require addData */
                        const graphData = graph.getData();
                        const formatData = removeExistElement(
                          graphData,
                          translatorData
                        );

                        if (
                          !formatData.nodes.length &&
                          !formatData.edges.length
                        ) {
                          setIsCanvasLoading(false);
                          return;
                        }

                        window.Tracert.call('click', "a4378.b118751.c400430.d533737")

                        const extendId = id;
                        const extendData =
                          graphRef.current?.getNodeData(extendId);

                        /** The init node style is required in addData and the initial coordinates of the extended node are set */
                        graphRef.current.addData({
                          nodes: formatData?.nodes?.map((node) => ({
                            ...node,
                            style: extendData?.style,
                          })),
                          edges: formatData.edges,
                        });

                        /** Whether the extended point needs to update the style, such as nodeSize */
                        if (formatData.nodes.length > 1) {
                          const updateNodeData = translatorData.nodes.find(
                            (node) => {
                              return node.id === extendId;
                            }
                          );
                          graphRef.current.updateNodeData([updateNodeData]);
                        }

                        /** Update node size */
                        const mergeData = graphRef.current.getData();
                        graphRef.current.updateData(
                          graphDataTranslator(mergeData)
                        );

                        /** used3 force */
                        graphRef.current?.setOptions({
                          layout: {
                            type: "d3-force",
                            x: {},
                            y: {},
                            link: {
                              distance: 200,
                            },
                            collide: {
                              radius: 36,
                            },
                            manyBody: {
                              strength: -900,
                            },
                          },
                        });
                        await graphRef.current.render();
                        setIsCanvasLoading(false);
                        setHistoryStatus({ undo: false, redo: true });
                        const history =
                          graphRef.current?.getPluginInstance("history");
                        history.redoStack = [];
                        updateGraphDataMapXY(graphRef.current);
                      }
                    })
                    .catch((err) => {
                      console.log("更新失败：", err);
                    })
                    .finally(() => {
                      setIsCanvasLoading(false);
                    });
                };

                const getMenuItems = (type: string) => {
                  if (isShare) return;

                  if (type === NODE_TYPE_MAP.github_repo) {
                    return [
                      {
                        name: t("template.REPO_CONTRIBUTE"),
                        templateType: "project-contribution",
                        key: "1",
                      },
                      {
                        name: t("template.REPO_ECOLOGY"),
                        templateType: "project-ecosystem",
                        key: "2",
                      },
                      {
                        name: t("template.REPO_COMMUNITY"),
                        templateType: "project-community",
                        key: "3",
                      },
                    ];
                  } else if (type === NODE_TYPE_MAP.github_user) {
                    return [
                      {
                        name: t("template.ACCT_ACTIVITY"),
                        templateType: "developer-activity",
                        key: "4",
                      },
                      {
                        name: t("template.ACCT_PARTNER"),
                        templateType: "os-partner",
                        key: "5",
                      },
                      {
                        name: t("template.ACCT_INTEREST"),
                        templateType: "os-interest",
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

        /** icon-font Perform rendering after loading is complete, otherwise it will flicker. */
        isFontLoaded("os-iconfont").then((isLoaded) => {
          if (isLoaded) {
            graph.render().then(async () => {
              const history = graphRef.current?.getPluginInstance("history");
              updateGraphDataMapXY(graphRef.current);
              history.on(HistoryEvent.ADD, (event) => {
                formatUndoStack(history.undoStack);
              });
              history.on(HistoryEvent.REDO, async (event) => {
                // const updateRemoveNodeData = updateDataXY(
                //   history.undoStack[history.undoStack.length - 1]?.original
                //     ?.remove
                // );

                // graphRef.current?.updateData(updateRemoveNodeData);
                await graphRef.current.render();
                setHistoryStatus({
                  undo: false,
                  redo: history.redoStack?.length < 1,
                });
              });
              history.on(HistoryEvent.UNDO, async () => {
                await graphRef.current.render();
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
        graph.on(CanvasEvent.CLICK, (e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey) {
            e?.preventDefault();
          }
        });

        if (isFunction(onReady)) onReady(graph);
      };

      const render3DGraph = () => {
        /**  Deep copy data and map edges to links */
        const graph3DData = formatGraph3DData(data);
        const highlightNodes = new Set();
        const highlightLinks = new Set();
        let nodeMaterials = new Map();
        let hoverNode: any = null;

        /** Highlight nodes and links */
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

        /** After the icon is loaded, build the nodeThree custom node */
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

          /** When clicking on other areas of the canvas, collapse the contextMenu */
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
