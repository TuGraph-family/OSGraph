// @ts-nocheck
import React from "react";
import { Graph } from "@antv/g6";
import type { DataID } from "@antv/g6";
import { isEqual, isFunction, uniq } from "lodash";
import { NODE_COLORS } from "../../constants";
import Org from "../../assets/org.svg";
import User from "../../assets/user.svg";
import Country from "../../assets/country.svg";
import Project from "../../assets/project.svg";

const ICON_MAPPING = {
  org: Org,
  user: User,
  country: Country,
  project: Project,
};

interface IProps {
  data: DataID;
  onReady?: (graph: Graph) => void;
}

export const GraphView = React.memo(
  ({ data, onReady }: IProps) => {
    const containerRef = React.useRef(null);
    const graphRef = React.useRef<Graph>(null);
    const { nodes } = data;
    const types = uniq(nodes.map((item) => item.nodeType));

    const renderGraph = () => {
      const { clientHeight: height, clientWidth: width } = containerRef.current;

      const graph = new Graph({
        container: containerRef.current as HTMLDivElement,
        data,
        width,
        height,
        node: {
          style: {
            size: (d) => d.size,
            labelText: (d) => d.label,
            iconHeight: (d) => d.size / 2,
            iconWidth: (d) => d.size / 2,
            iconSrc: (d) => ICON_MAPPING[d.nodeType],
            halo: true,
            color: (d) => {
              return NODE_COLORS[types.indexOf(d.nodeType)];
            },
          },
        },
        edge: {
          style: {
            type: (item) => item.type || "line",
            labelText: (d) => d.label,
            endArrow: true,
            labelBackgroundFill: "#fff",
            labelBackground: true,
            stroke: "#99ADD1",
          },
        },
        layout: {
          type: "force",
          linkDistance: 50,
          maxSpeed: 100,
          animated: true,
          clustering: true,
          nodeClusterBy: "cluster",
          clusterNodeStrength: 70,
        },
        behaviors: [
          "zoom-canvas",
          "drag-canvas",
          "drag-element",
          "click-selected",
        ],
        autoResize: true,
        zoomRange: [0.1, 5],
        autoFit: "view",
      });

      graph.render();
      graphRef.current = graph;
      if (isFunction(onReady)) onReady(graph);
    };

    React.useEffect(() => {
      if (!containerRef.current) return;
      renderGraph();
      return () => {
        if (graphRef.current) graphRef.current.destroy();
      };
    }, [containerRef.current]);

    return <div ref={containerRef} style={{ height: "100%" }}></div>;
  },
  (pre: IProps, next: IProps) => {
    return isEqual(pre.data, next.data);
  }
);
