// @ts-nocheck
/**
 * file: render 3d function
 * author: Allen
*/
import type { GraphData } from "@antv/g6";
import { cloneDeep, nth } from "lodash";
import SpriteText from 'three-spritetext';
import * as THREE from 'three';
import { iconLoader } from "../components/icon-font";
import { ForceGraph3DInstance } from "3d-force-graph";


import { EDGE_DISPLAY_NAME_MAP, NODE_TYPE_ICON_MAP, NODE_TYPE_COLOR_MAP } from "../constants";

/** pre handle graph data, add rotate and curvature */
const formatGraph3DData = (data: GraphData) => {
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
  graph3DData.links = graph3DData.links?.map(link => {
    const offsetAndRotateObj = genOffsetAndRotate(link.source.id, link.target.id);
    return {
      ...link,
      rotation: offsetAndRotateObj.rotation || 0,
      offset: offsetAndRotateObj.offset || 0
    }
  });

  /** 设置 curvature */
  graph3DData.links = graph3DData.links?.map(link => {
    return {
        ...link,
        curvature: recordLinks[link.source.id + link.target.id].length > 1 ? 2 : 0.1
    }
  });

  graph3DData.links?.forEach((link) => {
    const sourceNode = graph3DData.nodes?.find((node) => node.id === link.source);
    const targetNode = graph3DData.nodes?.find((node) => node.id === link.target);
    if (sourceNode) {
      if (!sourceNode.neighbors) sourceNode.neighbors = [];
      if (!sourceNode.links) sourceNode.links = [];
      sourceNode.neighbors?.push(targetNode);
      sourceNode.links?.push(link);
    }
    if (targetNode) {
      if (!targetNode.neighbors) targetNode.neighbors = [];
      if (!targetNode.links) targetNode.links = [];
      targetNode.neighbors?.push(sourceNode);
      targetNode.links?.push(link);
    }
  });
  return graph3DData;
};

const generateLinkText = (link: Record<string, any>) => {
  const { displayName, hasCount } = EDGE_DISPLAY_NAME_MAP[link?.edgeType];
  const spriteText = ` ${displayName}${hasCount ? "：" + (link?.properties?.count || 0) + " " : ""}`
  const sprite = new SpriteText(spriteText);
  sprite.color = 'lightgrey';
  sprite.textHeight = 1.5;
  sprite.offset = link.offset;
  return sprite;
};

const updateLinkPosition = (sprite: any, options: any) => {
  const { start, end } = options;
  const middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
    [c]: start[c] + (end[c] - start[c]) / 2
  })));
  middlePos.y += sprite.offset;
  Object.assign(sprite.position, middlePos);
};

const createTextTexture = ({text, iconText, nodeSize}: {text: string, iconText: string, nodeSize: number}) => {

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  const canvasSize = Math.min(250, nodeSize * 10);
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  // 图标部分
  const iconSize = canvasSize / 2;
  context.font = `${iconSize}px os-iconfont`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = 'rgba(255, 255, 255, 0.8)';

  // 绘制图标
  const iconX = canvas.width / 2;
  const iconY = canvas.height / 3;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(iconText, iconX, iconY);

  // 文本部分
  let fontSize = nodeSize * 3;
  context.font = `${fontSize}px os-iconfont`;
  context.fillStyle = 'rgba(255, 255, 255, 0.8)';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  /** 计算文本宽度和高度, 并留出边距 */
  const maxWidth = canvas.width - 20;

  /** 渲染文字并调整字体大小 */
  while (context.measureText(text).width > maxWidth || fontSize > canvas.height) {
    fontSize -= 2;
    context.font = `${fontSize}px os-iconfont`;
  }

  const x = canvas.width / 2;
  const y = iconY + iconSize / 4 + iconSize / 2;
  context.fillText(text, x, y);

  return canvas;
};

const getRandomColor = (nodeType: string) => {

  return nodeType === 'github_user'
    ? NODE_TYPE_COLOR_MAP[nodeType][Math.floor(Math.random() * 4)]
    : NODE_TYPE_COLOR_MAP[nodeType];
};

const generateNodeThreeObject = (nodeMaterials: Map<any, any>, node: Record<string, any>) => {
  const nodeColor = getRandomColor(node.nodeType);
    
  /** 创建一个球体节点 */
  const sphereGeometry = new THREE.SphereGeometry( node.size / 3, 32, 32 );
  const sphereMaterial = new THREE.MeshBasicMaterial( { color: nodeColor, opacity: 0.75, transparent: true } );
  const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );

  /** map 缓存每个 nodeThreeObject, 用户后续颜色高亮设置， nodeColor 不能用于设置 nodeThreeObject 节点 */
  nodeMaterials.set(node, {...sphereMaterial, nodeColor });

  /** 创建一个节点的文本标签 */
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(createTextTexture({
      text: node?.properties?.name,
      iconText: iconLoader(NODE_TYPE_ICON_MAP[node?.nodeType]),
      nodeSize: node?.size,
      iconFontSize: node?.iconFontSize
    })),
    depthTest: false
  }));

  const scaleRadio = node?.size > 30 ? 20 : 10;
  sprite.scale.set(scaleRadio, scaleRadio, 1);
  sphere.add(sprite);
  return sphere;
};

const getAdjustDistance = (graph: ForceGraph3DInstance) => {
  const nodes = graph.graphData().nodes;
  const maxDistance = Math.max(
    ...nodes.map(n => Math.hypot(n.x, n.y, n.z))
  );
  const distance = maxDistance * 1.5;
  return distance;
}

const focusNodePositionForClick = (graph: ForceGraph3DInstance, node: Object) => {
  const distance = getAdjustDistance(graph);
  const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

  const newPos = node.x || node.y || node.z
    ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
    : { x: 0, y: 0, z: distance };

  graph.cameraPosition(
    newPos,
    node,
    1000
  );
};

const calcTooltipPos = (graph: ForceGraph3DInstance, node: Object) => {
  const { x, y, z } = node;
  // 获取相机、渲染器和控制
  const camera = graph.camera();
  const renderer = graph.renderer();
  // 创建向量并将其转换为屏幕坐标
  const vec = new THREE.Vector3(x, y, z);
  vec.project(camera);
  const widthHalf = renderer.domElement.clientWidth / 2;
  const heightHalf = renderer.domElement.clientHeight / 2;
  const screenCoords = {
    x: (vec.x * widthHalf) + widthHalf,
    y: -(vec.y * heightHalf) + heightHalf
  };
  return screenCoords;
};

export {
    formatGraph3DData,
    // link
    generateLinkText,
    updateLinkPosition,
    // node
    generateNodeThreeObject,
    focusNodePositionForClick,
    calcTooltipPos
};