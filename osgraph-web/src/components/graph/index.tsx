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
import { mergeEdgeIdReg } from '../../constants/regExp';
import { iconLoader } from "../icon-font";
import { filterGraphDataTranslator } from "./translator/filterGraphData";
import { removeExistElement } from "./translator/removeExistElement";
import { GRAPH_TEMPLATE_ENUM, HIDDEN_END_ARROW_TYPE } from "../../constants/index";
import { getExecuteShareLinkQuery } from "../../services/result_new";
import { graphDataTranslator } from "../../result/translator";
import { GET_EDGE_DISPLAY_NAME_MAP } from "../../constants/data";
import ReactDOM from "react-dom";
import LayoutSelect from "../layout-select";
import GraphMenuItem from "../graph-menu-item";
import { createRoot } from "react-dom/client";
import MultipleSelects from "./plugin/multiple-selects";
import { checkConsistency, runMergeEdge, groupBySourceAndTarget } from '@/utils/graph-merge'
import moment from "moment";

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
  queryList?: Record<string, any>[];
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
      { data, renderMode, renderTemplate, setHistoryStatus, onReady, queryList }: IProps,
      ref,
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

      const getMenuList = useMemo(() => {
        if (isShare) return [];
        return queryList?.map(item => {
          return {
            type: item.input_types,
            name: item.name,
            key: item.id,
            templateParameterList: item.templateParameterList,
            path: item.path
          }
        }) || []
      }, [queryList]);



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
              cursor: 'default'
            },
          },
          edge: {
            type: (edge) => {
              if (mergeEdgeIdReg.test(edge?.id)) {
                return 'line'
              }
              return edge?.type

            },
            style: {
              labelText: (d) => {
                if (mergeEdgeIdReg.test(d?.id)) {
                  return d?.style?.labelText
                }
                return `${d?.name}${d?.edgeType !== 'Belong' ? "：" + (d?.properties?.count || 0) + " " : ""
                  }`;
              },
              endArrow: (d) => !HIDDEN_END_ARROW_TYPE.includes(d?.edgeType),
              labelBackgroundFill: "#fff",
              labelBackground: true,
              stroke: (d) =>
                d.targetNodeType === NODE_TYPE_MAP.github_user
                  ? NODE_TYPE_COLOR_MAP[d.targetNodeType][d.target % 4]
                  : NODE_TYPE_COLOR_MAP[d.targetNodeType],
              labelOpacity: 1,
              lineWidth: (d) => d?.lineWidth || 2,
              endArrowSize: (d) => d?.endArrowSize || 10,
              labelFontSize: 10,
              haloStrokeOpacity: 0.11,
              cursor: 'default'
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
          combo: {
            type: 'circle',
            // 组合类型
            style: {
              collapsed: true,
            },
          },
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
                getTooltipContent(record, t, graphRef),
            },
            {
              type: "history",
              key: "history",
            },
            {
              type: "contextmenu",
              trigger: "contextmenu",
              getContent: (event) => {
                const id = event.target.id;
                const g6ContextMenuDom =
                  document.getElementsByClassName("g6-contextmenu")[0];
                if (g6ContextMenuDom) {
                  g6ContextMenuDom.style.overflow = "visible";
                }


                const mountNode = document.createElement("div");
                const root = createRoot(mountNode);
                const selectedNodes = graphRef.current?.getElementDataByState('node', 'selected');
                const selectedEdges = graphRef.current?.getElementDataByState('edge', 'selected');
                if (selectedNodes?.length > 1 && event.targetType === "node") {
                  //merge node

                  const onClick = () => {
                    const comboId = `combo-${moment().valueOf()}`;
                    graphRef.current?.addComboData([{ id: comboId }]);
                    const adjacentEdge: Record<string, any>[] = [];
                    const selectedNodeId = selectedNodes.map(item => item.id);
                    let newEdges = []
                    graphRef.current.setData((prev) => {
                      newEdges = prev.edges?.map((item) => {
                        const { source, target } = item;
                        if (
                          selectedNodeId.includes(source) &&
                          selectedNodeId.includes(target)
                        ) {
                          return {
                            ...item,
                            combo: comboId,
                            style: {
                              ...item.style,
                              visibility: 'hidden'
                            },
                          };
                        } else {
                          if (selectedNodeId.includes(source)) {
                            item.source = comboId;
                            item.originSource = source;
                            adjacentEdge.push(item);
                          }
                          if (selectedNodeId.includes(target)) {
                            item.target = comboId;
                            item.originTarget = target;
                            adjacentEdge.push(item);
                          }
                          return item;
                        }
                      })

                      return ({
                        ...prev,
                        nodes: prev.nodes?.map((item) => {
                          if (selectedNodeId.includes(item?.id)) {
                            return {
                              ...item,
                              combo: comboId,
                              states: [],
                              style: {
                                ...item.style,
                                visibility: 'hidden'
                              },
                            };
                          } else {
                            return item;
                          }
                        }),
                        edges: newEdges,
                      })

                    });

                    const adjacentEdgeGrpup = groupBySourceAndTarget(adjacentEdge);

                    if (adjacentEdgeGrpup.some((item) => item.length > 1)) {
                      // have merge edge
                      adjacentEdgeGrpup
                        ?.filter((item) => item.length > 1)
                        .forEach((edgeList, idx) => {
                          const edgeIds = edgeList?.map((item) => item.id);
                          newEdges = runMergeEdge(edgeIds, edgeList[0]?.source, edgeList[0]?.target, idx, [...newEdges]);
                        });

                      graphRef.current.setData((prev) => ({
                        ...prev,
                        edges: newEdges
                      }))
                    }
                    graphRef.current?.draw();
                  };

                  root.render(
                    <ul className="g6-contextmenu-ul">
                      <li className="g6-contextmenu-li" onClick={onClick}>合并节点</li>
                    </ul>
                  );


                } else if (selectedEdges?.length > 1 && event.targetType === "edge") {
                  // merge edge

                  const mergeEdgeIds = checkConsistency(selectedEdges, id)
                  if (mergeEdgeIds.length > 1) {
                    const onClick = () => {
                      const edge = graphRef.current?.getEdgeData(mergeEdgeIds[0]);
                      graphRef.current?.setData((prev) => ({
                        ...prev,
                        edges: runMergeEdge(mergeEdgeIds, edge?.source, edge?.target, 0, prev.edges)
                      }))
                      graphRef.current?.draw();
                    };


                    root.render(
                      <ul className="g6-contextmenu-ul">
                        <li className="g6-contextmenu-li" onClick={onClick}>合并边</li>
                      </ul>
                    );
                  }
                } else if (event.targetType === "node") {
                  const data = graphRef.current?.getNodeData(id);
                  const { properties } = data;
                  const onClick = (path, extendsStr) => {
                    setIsCanvasLoading(true);
                    getExecuteShareLinkQuery({
                      templateType: path,
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

                  const menuList = getMenuList?.filter(item => item.type === data.nodeType);

                  root.render(
                    <ul className="g6-contextmenu-ul">
                      {menuList?.map((item) => (
                        <GraphMenuItem
                          key={item.key}
                          title={item.name}
                          path={item.path}
                          templateId={item.key}
                          onSearch={(params: string) =>
                            onClick(item.path, params)
                          }
                          templateParameterList={item?.templateParameterList}
                        />
                      ))}
                    </ul>
                  );

                } else if (event.targetType === "edge" && id.startsWith('merge-edge')) {
                  const data = graphRef.current?.getEdgeData(id);

                  const onClick = () => {
                    if (graphRef.current) {
                      graphRef.current?.setData((prev) => ({
                        ...prev,
                        edges: prev.edges.map((item) => {
                          if (data?.mergeEdgeId.includes(item?.id)) {
                            return {
                              ...item,
                              style: {
                                ...item.style,
                                visibility: 'visible'
                              },
                            };
                          } else {
                            return item;
                          }
                        }),
                      }));
                      graphRef.current?.removeEdgeData([id]);
                      graphRef.current?.draw();
                    }
                  };
                  root.render(
                    <ul className="g6-contextmenu-ul">
                      <li className="g6-contextmenu-li" onClick={onClick}>展开边</li>
                    </ul>
                  );

                } else if (event.targetType === "combo") {

                  const comboId = event.target.id;
                  const onClick = () => {
                    graphRef.current?.setData((prev) => {
                      data = {
                        ...prev,
                        nodes: prev.nodes?.map((item) => {
                          if (item.combo === comboId) {
                            delete item.combo;
                            return {
                              ...item,
                              style: {
                                ...item.style,
                                visibility: 'visible'
                              },
                            };
                          } else {
                            return item;
                          }
                        }),
                        edges: prev.edges
                          ?.filter((edgeItem) => {
                            return !(
                              mergeEdgeIdReg.test(edgeItem?.id) &&
                              [edgeItem?.combo, edgeItem?.source, edgeItem?.target].includes(
                                comboId,
                              )
                            );
                          })
                          .map((item) => {
                            if (item?.combo === comboId) {
                              delete item?.combo;
                              return {
                                ...item,
                                style: {
                                  ...item?.style,
                                  visibility: 'visible'
                                },
                              };
                            } else if ([item?.source, item?.target].includes(comboId)) {
                              if (item?.originSource) {
                                item.source = item.originSource;
                                item.style.sourceNode = item.originSource;
                                delete item.originSource;
                              }
                              if (item?.originTarget) {
                                item.target = item.originTarget;
                                item.style.targetNode = item.originTarget;
                                delete item.originTarget;
                              }
                              return {
                                ...item,
                                style: {
                                  ...item?.style,
                                  visibility: 'visible'
                                },
                              };
                            }
                            return item
                          }),
                        combos: prev.combos?.filter((item) => item?.id !== comboId),
                      };
                      return data;
                    });

                    graphRef.current?.draw();
                  };
                  root.render(
                    <ul className="g6-contextmenu-ul">
                      <li className="g6-contextmenu-li" onClick={onClick}>展开节点</li>
                    </ul>
                  );
                }
                return mountNode;
              },
              enable: (e) => {
                return ['edge', 'node', 'combo'].includes(e.targetType)
              }
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
        if ((!isEmpty(getMenuList) || isShare) && (!isEmpty(data?.nodes) || !isEmpty(data?.edges))) {
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
      }, [containerRef.current, data, renderMode, getMenuList]);

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
      isEqual(pre.data, next.data) && isEqual(pre?.renderMode, next?.renderMode) && isEqual(pre?.queryList, next?.queryList)
    );
  }
);
