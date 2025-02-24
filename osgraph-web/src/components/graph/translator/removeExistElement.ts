/**
 * file: Filter nodes that already exist in the Graph
 * author: Allen
 */

import type { GraphData } from "@antv/g6";

const removeExistElement = (
  originData: GraphData,
  addData: GraphData
): GraphData => {
  const existingNodeIds = new Set(originData.nodes?.map((node) => node.id));
  const existingEdges = new Set(
    originData.edges?.map((edge) => `${edge.source}-${edge.target}`)
  );

  const newNodes = addData.nodes?.filter(
    (node) => !existingNodeIds.has(node.id)
  );

  const newEdges = addData.edges?.filter(
    (edge) => !existingEdges.has(`${edge.source}-${edge.target}`)
  );

  return {
    nodes: newNodes,
    edges: newEdges,
  };
};

export { removeExistElement };
