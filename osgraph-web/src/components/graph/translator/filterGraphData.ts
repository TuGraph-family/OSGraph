/**
 * file: filter nodes and edges
 * author: Allen
 */

import { GraphData } from "@antv/g6";

/** Filter isolated nodes and edges with no nodes */
const filterGraphDataTranslator = (data: GraphData): GraphData => {
  if (!data || !Array.isArray(data?.nodes) || !Array.isArray(data?.edges)) {
    return { nodes: [], edges: [] };
  }

  const nodeSet = new Set(data.nodes.map((node) => node.id));
  const validEdges = data.edges.filter(
    (edge) => nodeSet.has(edge.source) && nodeSet.has(edge.target)
  );

  // After updating the edge set, re-create the new node set to ensure that each node is used in the new edge set
  const connectedNodeSet = new Set<string>();
  validEdges.forEach((edge) => {
    connectedNodeSet.add(edge.source);
    connectedNodeSet.add(edge.target);
  });

  // Filter out nodes that are not in the edge set
  const validNodes = data.nodes.filter((node) => connectedNodeSet.has(node.id));

  // Return filtered data
  return {
    nodes: validNodes,
    edges: validEdges,
  };
};

export { filterGraphDataTranslator };
