/**
 * file: handle diff of pre and cur
 * author: Allen
 */

import { GraphData } from '@antv/g6';

const diffGraphs = (preGraphData: GraphData, curGraphData: GraphData) => {
  const getNodeMap = (graph: GraphData) =>
    new Map(graph?.nodes?.map((node) => [node.id, node]));
  const getEdgeMap = (graph: GraphData) =>
    new Map(
      graph?.edges?.map((edge) => [`${edge.source}-${edge.target}`, edge]),
    );

  const nodesPreGraphData = getNodeMap(preGraphData);
  const nodesCurGraphData = getNodeMap(curGraphData);

  const edgesPreGraphData = getEdgeMap(preGraphData);
  const edgesCurGraphData = getEdgeMap(curGraphData);

  const add: GraphData = { nodes: [], edges: [] };
  const remove: GraphData = { nodes: [], edges: [] };
  const update: GraphData = { nodes: [], edges: [] };

  /** add nodes */
  for (const [id, node] of nodesCurGraphData) {
    if (!nodesPreGraphData.has(id)) {
      add.nodes?.push(node);
    }
  }

  /** remove nodes */
  for (const [id, node] of nodesPreGraphData) {
    if (!nodesCurGraphData.has(id)) {
      remove.nodes?.push(node);
    }
  }

  /** update nodes */
  for (const [id, node] of nodesCurGraphData) {
    if (nodesPreGraphData.has(id)) {
      update.nodes?.push(node);
    }
  }

  /** add edges */
  for (const [id, edge] of edgesCurGraphData) {
    if (!edgesPreGraphData.has(id)) {
      add.edges?.push(edge);
    }
  }

  /** remove edges */
  for (const [id, edge] of edgesPreGraphData) {
    if (!edgesCurGraphData.has(id)) {
      remove.edges?.push(edge);
    }
  }

  /** update edges */
  for (const [id, edge] of edgesCurGraphData) {
    if (edgesPreGraphData.has(id)) {
      update.edges?.push(edge);
    }
  }

  return { add, remove, update };
};

export { diffGraphs };