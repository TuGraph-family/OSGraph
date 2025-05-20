/**
 * file: filter nodes and edges
 * author: Allen
 */

import { GraphData } from "@antv/g6";

import { groupBySourceAndTarget, runMergeEdge } from "@/utils/graph-merge";


/** Filter isolated nodes and edges with no nodes */
const filterGraphDataTranslator = (data: GraphData): GraphData => {
  if (!data || !Array.isArray(data?.nodes) || !Array.isArray(data?.edges)) {
    return { nodes: [], edges: [] };
  }

  const nodeSet = new Set(data.nodes.map((node) => node.id));
  let validEdges = data.edges.filter(
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


  const adjacentEdgeGrpup = groupBySourceAndTarget(validEdges);



  if (adjacentEdgeGrpup.some((item) => item.length > 1)) {
    // 相邻边存在可合并
    adjacentEdgeGrpup
      ?.filter((item) => item.length > 1)
      .forEach((edgeList, idx) => {
        const edgeIds = edgeList?.map((item: any) => item.id);
        validEdges = runMergeEdge(edgeIds, edgeList[0]?.source, edgeList[0]?.target, idx, validEdges) || [];
      });
  }

  // Return filtered data
  return {
    nodes: validNodes,
    edges: validEdges,
  };
};

export { filterGraphDataTranslator };
