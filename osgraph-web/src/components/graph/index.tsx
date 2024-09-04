// @ts-nocheck
import type { DataID } from "@antv/g6";
import { Graph, GraphEvent } from "@antv/g6";
import { Button, message, Space } from "antd";
import { isEmpty, isEqual, isFunction, cloneDeep, nth } from "lodash";
import React, { useRef } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactDOM from "react-dom/client";
import ForceGraph3D from '3d-force-graph';
import SpriteText from 'three-spritetext';
import * as THREE from 'three';
import { useTranslation } from "react-i18next";
import { throttle } from 'lodash';
import {
  EDGE_DISPLAY_NAME_MAP,
  NODE_TYPE_COLOR_MAP,
  NODE_TYPE_ICON_MAP,
  NODE_TYPE_MAP,
  NODE_TYPE_SHOW_GITHUB_LINK_MAP
} from "../../constants";
import { IconFont, iconLoader } from "../icon-font";
import { filterGraphDataTranslator } from './translator/filterGraphData';

interface IProps {
  data: DataID;
  onReady?: (graph: Graph) => void;
}

export const GraphView = React.memo(
  ({ data, onReady }: IProps) => {
    const containerRef = React.useRef(null);
    const graphRef = React.useRef<Graph>(null);
    const { t } = useTranslation();
    const selectEdges = useRef<string[]>([]);

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

    const render3DGraph = () => {
      const { clientHeight: height, clientWidth: width } = containerRef.current;

      /**  数据深拷贝，且把 edges 映射到 links上 */
      const graph3DData = cloneDeep({ ...data, links: data.edges });

      const recordLinks: Record<string, number[]> = {};
      /** 写一个函数，为每条边生成一个 curvature 和 rotate 的值 */
      const genOffsetAndRotate = (source: number, target: number) => {
        /** 将 source 和 target 组合成key */
        const key = source + target;
        if (recordLinks[key]) {
          /** 取出数组的最后一位 */
          const rotation = nth(recordLinks[source + target], -1) + Math.PI * 1/6;
          recordLinks[source + target] = [...recordLinks[source + target], rotation];
          const offset = 0.25 * recordLinks[source + target]?.length;
          return { offset, rotation };
        }
        else {
          recordLinks[source + target] = [0];
          return { offset: 0, rotation: 0 };
        }
      };

      /** 设置 rotation */
      graph3DData.links = graph3DData.links.map(link => {
        const offsetAndRotateObj = genOffsetAndRotate(link.source.id, link.target.id);
        return {
          ...link,
          rotation: offsetAndRotateObj.rotation || 0,
          offset: offsetAndRotateObj.offset || 0
        }
      });

      /** 设置 curvature */
      graph3DData.links = graph3DData.links.map(link => {
        return {
          ...link,
          curvature: recordLinks[link.source.id + link.target.id].length > 1 ? 0.8 : 0.1
        }
      });

      graph3DData.links.forEach((link) => {
        const sourceNode = graph3DData.nodes.find((node) => node.id === link.source);
        const targetNode = graph3DData.nodes.find((node) => node.id === link.target);
        if (sourceNode) {
          if (!sourceNode.neighbors) sourceNode.neighbors = [];
          if (!sourceNode.links) sourceNode.links = [];
          sourceNode.neighbors.push(targetNode);
          sourceNode.links.push(link);
        }
        if (targetNode) {
          if (!targetNode.neighbors) targetNode.neighbors = [];
          if (!targetNode.links) targetNode.links = [];
          targetNode.neighbors.push(sourceNode);
          targetNode.links.push(link);
        }
      });
      const highlightNodes = new Set();
      const highlightLinks = new Set();
      let nodeMaterials = new Map();
      let hoverNode: any = null;

      const graph = ForceGraph3D({controlType: 'trackball'})(containerRef.current)
        .cameraPosition({ x: 0, y: 0, z: 177 })
        .nodeOpacity(0.6)
        .linkThreeObjectExtend(true)
        .linkCurvature('curvature')
        .linkCurveRotation('rotation')
        .linkWidth(0.4)
        .linkDirectionalParticleSpeed(0.01)
        .linkCurvature(0.1)
        .linkDirectionalArrowLength(1.5)
        .linkDirectionalArrowRelPos(0.99)
        .linkDirectionalParticleWidth(1)
        .linkDirectionalArrowColor(link => link.source.color)
        .nodeThreeObjectExtend(true)
        .linkDirectionalParticles(link =>
          highlightLinks.has(link) || selectEdges.current.includes(link.id) ? 1.5 : 0
        )
        .linkWidth(link =>
          highlightLinks.has(link) || selectEdges.current.includes(link.id) ? 1.5 : 0.2
        )
        .linkThreeObject(link => {
          const { displayName, hasCount } = EDGE_DISPLAY_NAME_MAP[link?.edgeType];
          const spriteText = ` ${displayName}${hasCount ? "：" + (link?.properties?.count || 0) + " " : ""}`
          const sprite = new SpriteText(spriteText);
          sprite.color = 'lightgrey';
          sprite.textHeight = 1.5;
          sprite.offset = link.offset;
          return sprite;
        })
        .linkPositionUpdate((sprite, options) => {
          const { start, end } = options;
          const middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
            [c]: start[c] + (end[c] - start[c]) / 2
          })));
          middlePos.y += sprite.offset;
          Object.assign(sprite.position, middlePos);
        });

        graphRef.current = graph;

        /** 高亮 node 和 link */
        const updateHighlight = () => {
          if (graph) {
            graph
              .nodeColor(graph.nodeColor())
              .linkWidth(graph.linkWidth())
              .linkDirectionalParticles(graph.linkDirectionalParticles())
          }
        };

        const createTextTexture = (text) => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = 200;
          canvas.height = 200;

          let fontSize = 40;
          context.font = `${fontSize}px Arial`;
          context.fillStyle = 'rgba(255, 255, 255, 0.8)';
          context.textAlign = 'center';
          context.textBaseline = 'middle';

          /** 计算文本宽度和高度, 并留出边距 */
          const maxWidth = canvas.width - 20;
          const maxHeight = canvas.height - 20;

          /** 渲染文字并调整字体大小 */
          while (context.measureText(text).width > maxWidth || fontSize > canvas.height) {
            fontSize -= 2;
            context.font = `${fontSize}px Arial`;
          }

          const x = canvas.width / 2;
          const y = canvas.height / 2;
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.fillText(text, x, y);

          return canvas;
        };

        graph
        .graphData(graph3DData)
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
              ? material.color.set('yellow')
              : material.color.set('green');
          });
          updateHighlight();
        })
        .onNodeClick(node => {
          // Aim at node from outside it

          const distance = 40;
          const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

          const newPos = node.x || node.y || node.z
            ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
            : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

          graph.cameraPosition(
            newPos, // new position
            node, // lookAt ({ x, y, z })
            3000  // ms transition duration
          );
        })
        .onNodeDragEnd(node => {
          node.fx = node.x;
          node.fy = node.y;
          node.fz = node.z;
        })
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

        .nodeThreeObject((node) => {
          const group = new THREE.Group();

          /** 创建一个球体节点 */
          const sphereGeometry = new THREE.SphereGeometry( 5, 64, 64 );
          const sphereMaterial = new THREE.MeshBasicMaterial( { color: 'green', opacity: 0.5, transparent: true } );
          const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );

          /** map 缓存每个 nodeThreeObject, 用户后续颜色高亮设置， nodeColor 不能用于设置 nodeThreeObject 节点 */
          nodeMaterials.set(node, sphereMaterial);
          group.add( sphere );

          /** 创建一个节点的文本标签 */
          const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(createTextTexture(node?.properties?.name)),
            depthTest: false
          }));

          sprite.scale.set(10, 10, 1);
          group.add(sprite);
          return group;
        })
        graph.d3Force('charge').strength(-160);
    };

    React.useEffect(() => {
      if (!isEmpty(data?.nodes) || !isEmpty(data?.edges)) {
        if (!containerRef.current) return;
        // renderGraph();
        render3DGraph();
        return () => {
          if (graphRef.current) {
            // graphRef.current.off(GraphEvent.AFTER_LAYOUT, handleAfterLayout);
            // graphRef.current.destroy();
            graphRef.current(null);
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
