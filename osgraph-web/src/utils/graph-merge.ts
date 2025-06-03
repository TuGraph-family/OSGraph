import { mergeEdgeIdReg } from "@/constants/regExp";
import moment from "moment";

// check merge edges
const checkConsistency = (edges: Record<string, any>[]) => {
    const newEdges = edges?.filter((edgesItem: Record<string, any>) => edgesItem?.style?.opacity !== 0)
    if (newEdges.length === 0) {
        return [];
    }
    const baseSource = newEdges[0]?.source;
    const baseTarget = newEdges[0]?.target;
    const ids = [];
    for (const item of newEdges) {
        if (item?.source !== baseSource || item?.target !== baseTarget) {
            return [];
        }
        ids.push(item.id);
    }
    return ids;
};

// 相同指向的边
const groupBySourceAndTarget = (arr: any) => {
    if (!Array.isArray(arr) || arr.length === 0) {
        return [];
    }

    const groups = new Map();

    for (const item of arr) {
        const { source, target } = item;
        const key = `${source}-${target}`;

        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(item);
    }

    return Array.from(groups.values());
};

const runMergeEdge = (
    edgeIds: string[],
    source: string,
    target: string,
    key: number,
    edges?: Record<string, any>[]
) => {
    const mergeEdgeId = `merge-edge-${key}-${moment().valueOf()}`;
    let targetNodeType = ''
    const newEdges = [];
    let newMergeEdgeId: string[] = []

    edges?.forEach((item) => {
        if (edgeIds.includes(item.id)) {
            if (!targetNodeType) {
                targetNodeType = item.targetNodeType
            }
            if (mergeEdgeIdReg.test(item.id)) {
                newMergeEdgeId.push(...item.mergeEdgeId)
            } else {
                newEdges.push({
                    ...item,
                    states: [],
                    style: {
                        ...item.style,
                        visibility: 'hidden'
                    },
                });
                newMergeEdgeId.push(item.id)
            }
        } else {
            newEdges.push(item);
        }
    }) || []

    newMergeEdgeId = [...new Set(newMergeEdgeId)]

    newEdges?.unshift({
        id: mergeEdgeId,
        source: source,
        target: target,
        mergeEdgeId: newMergeEdgeId,
        label: newMergeEdgeId?.length,
        targetNodeType,
        style: {
            labelText: `${newMergeEdgeId.length}`,
            lineWidth: newMergeEdgeId.length,
        },
    },)
    return newEdges
};


export {
    checkConsistency,
    groupBySourceAndTarget,
    runMergeEdge,
}