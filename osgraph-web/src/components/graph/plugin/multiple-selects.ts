import type {
  BaseBehaviorOptions,
  IPointerEvent,
  RuntimeContext,
} from "@antv/g6";
import { BaseBehavior, CommonEvent } from "@antv/g6";

interface ClickAddNodeOptions extends BaseBehaviorOptions {}

const getElementState = (
  nodes: string[] = [],
  edges: string[] = []
): Record<string, string[]> => {
  const newElements: any = {};
  [...edges, ...nodes]?.forEach((item) => {
    newElements[item] = ["selected"];
  });

  return newElements;
};

class MultipleSelects extends BaseBehavior<ClickAddNodeOptions> {
  constructor(context: RuntimeContext, options: ClickAddNodeOptions) {
    super(context, options);

    const { graph } = this.context;
    graph.on(CommonEvent.CLICK, (event: IPointerEvent<any>) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey) {
        const { target, targetType } = event;
        const { id } = target;
        const currentState = graph.getElementState(id);

        if (currentState?.includes("selected")) {
          graph.setElementState(id);
          return;
        }
        if (event.shiftKey) {
          graph.setElementState(id, ["selected"]);
          return;
        }

        if (targetType === "node") {
          const edges =
            graph.getRelatedEdgesData(id, "both")?.map((item) => item.id) || [];
          const nodes: string[] =
            graph.getNeighborNodesData(id)?.map((item) => item.id) || [];
          graph.setElementState(getElementState([...nodes, id], edges));
        } else if (targetType === "edge") {
          const { source, target } = graph.getEdgeData(id);
          graph.setElementState(getElementState([source, target], [id]));
        }
      }
    });
  }
}

export default MultipleSelects;
