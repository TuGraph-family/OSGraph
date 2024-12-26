import { GraphData } from "@antv/g6";
import { NODE_TYPE_MAP } from "./../../constants/index";

const lineWidthList = [1, 2, 4];
const endArrowSizeList = [10, 11, 12];

export const graphDataTranslator = (graphData: GraphData) => {
  const nodeCountMap: Record<string, number> = {};
  let edgeMaxCount = -Infinity;
  let edgeMinCount = Infinity;
  graphData.edges?.forEach((item) => {
    const { source, target, properties } = item;
    const { count } = properties as any;

    if (nodeCountMap[source]) {
      nodeCountMap[source] = nodeCountMap[source] + (count || 0);
    } else {
      nodeCountMap[source] = count || 0;
    }
    if (nodeCountMap[target]) {
      nodeCountMap[target] = nodeCountMap[target] + (count || 0);
    } else {
      nodeCountMap[target] = count || 0;
    }
    if (count > edgeMaxCount) {
      edgeMaxCount = count;
    }
    if (count < edgeMinCount) {
      edgeMinCount = count;
    }
  });
  const edgeRange = (edgeMaxCount - edgeMinCount) / 2;
  const edges = graphData.edges?.map((item) => {
    const { target, properties } = item;
    const { count = edgeMinCount } = properties as any;
    const diffCount = parseInt(String((count - edgeMinCount) / edgeRange));
    const lineWidth = lineWidthList[diffCount];
    const endArrowSize = endArrowSizeList[diffCount];
    const targetNodeType = graphData.nodes?.find(
      (item) => item.id === target
    )?.nodeType;

    return {
      lineWidth,
      targetNodeType,
      endArrowSize,
      ...item,
    };
  });
  const countList = Object.values(nodeCountMap);
  const sourtedCount = countList.sort((a, b) => b - a);

  const nodeMaxCount = sourtedCount[1];
  const nodeMinCount = Math.min(...countList);
  const nodeCountRange = (nodeMaxCount - nodeMinCount) / 4;
  const nodes = graphData.nodes?.map((node) => {
    const { id, nodeType } = node;
    const nodeCount = nodeCountMap[id];
    const diffCount = (nodeCount - nodeMinCount) / nodeCountRange;

    let size = 16;
    let iconFontSize = 10;
    if (diffCount > 1 && diffCount < 2) {
      size = 26;
      iconFontSize = 18;
    } else if (diffCount >= 2 && diffCount <= 4) {
      size = 36;
      iconFontSize = 24;
    } else if (nodeCount === sourtedCount[0]) {
      size = 56;
      iconFontSize = 40;
    }

    if (
      (nodeType === NODE_TYPE_MAP.company ||
        nodeType === NODE_TYPE_MAP.github_organization) &&
      size === 16
    ) {
      size = 22;
      iconFontSize = 16;
    }
    if (nodeType === NODE_TYPE_MAP.country && size === 16) {
      size = 28;
      iconFontSize = 20;
    }

    return {
      ...node,
      iconFontSize,
      size,
    };
  });
  return {
    nodes,
    edges,
  };
};
