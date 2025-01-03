/**
 * file: filter nodes and edges
 * author: Allen
 */

import { GraphData } from "@antv/g6";

/** 过滤孤立节点，和不存在节点的边 */
const filterGraphDataTranslator = (data: GraphData): GraphData => {
  if (!data || !Array.isArray(data?.nodes) || !Array.isArray(data?.edges)) {
    return { nodes: [], edges: [] };
  }

  const nodeSet = new Set(data.nodes.map((node) => node.id));
  const validEdges = data.edges.filter(
    (edge) => nodeSet.has(edge.source) && nodeSet.has(edge.target)
  );

  // 更新边集合后，重新创建新的节点集合，确保每个节点在新的边集合中被使用
  const connectedNodeSet = new Set<string>();
  validEdges.forEach((edge) => {
    connectedNodeSet.add(edge.source);
    connectedNodeSet.add(edge.target);
  });

  // 过滤掉不在边集合中的节点
  const validNodes = data.nodes.filter((node) => connectedNodeSet.has(node.id));

  // 返回过滤后的数据
  return {
    nodes: validNodes,
    edges: validEdges,
  };
};

export { filterGraphDataTranslator };
