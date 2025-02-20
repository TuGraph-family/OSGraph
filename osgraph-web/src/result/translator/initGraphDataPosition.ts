/**
 * file: init graphs x, y position
 * author: Allen
 */

import { Graph } from "@antv/g6";

const initGraphDataPosition = async (graph?: Graph) => {
  if (!graph) {
    return;
  }

  const graphData = graph.getData();

  const positionList = [
    { x: 0, y: 0, z: 0 },
    { x: 800, y: 0, z: 0 },
    { x: 1600, y: 0, z: 0 },
    { x: 0, y: 800, z: 0 },
    { x: 0, y: 1600, z: 0 },
  ];

  let startIndex = 0;
  let startNodeMap: Record<string, { x: number; y: number; z: number }> = {};

  const formatNodeData = graphData?.nodes?.map((node) => {
    /** Here we need to do an initial layout algorithm */
    let positionStyle = {};
    if (node.size === 56) {
      positionStyle = positionList[startIndex];
      startNodeMap[node.id] = positionList[startIndex];
      startIndex++;
    }

    return {
      ...node,
      style: Object.assign({ zIndex: 1 }, positionStyle),
    };
  });

  graph.setData({
    nodes: formatNodeData,
    edges: graphData?.edges,
  });
};

export { initGraphDataPosition };
