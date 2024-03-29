/** @jsxImportSource @emotion/react */
import type { Graph } from "@antv/g6";
import { Modal, Button, message } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { OSGraph } from "../controller";
import { GraphView } from "../components";
import { GRAPH_STYLE } from "./style";

const MOCKDAT = {
  nodes: [
    {
      id: "0",
      size: 32,

      nodeType: "org",
    },
    {
      id: "1",
      size: 32,

      nodeType: "org",
    },
    {
      id: "2",
      size: 32,

      nodeType: "org",
    },
    {
      id: "3",
      size: 32,

      nodeType: "org",
    },
    {
      id: "4",
      size: 32,

      nodeType: "org",
    },
    {
      id: "5",
      size: 32,

      nodeType: "org",
    },
    {
      id: "6",
      size: 32,

      nodeType: "org",
    },
    {
      id: "7",
      size: 32,

      nodeType: "org",
    },
    {
      id: "8",
      size: 32,

      nodeType: "org",
    },
    {
      id: "9",
      size: 32,

      nodeType: "org",
    },
    {
      id: "10",
      size: 32,

      nodeType: "org",
    },
    {
      id: "11",
      size: 32,

      nodeType: "org",
    },
    {
      id: "12",
      size: 32,

      nodeType: "org",
    },
    {
      id: "13",
      size: 32,

      nodeType: "country",
    },
    {
      id: "14",
      size: 32,

      nodeType: "country",
    },
    {
      id: "15",
      size: 32,

      nodeType: "country",
    },
    {
      id: "16",
      size: 32,

      nodeType: "country",
    },
    {
      id: "17",
      size: 32,

      nodeType: "country",
    },
    {
      id: "18",
      size: 40,

      nodeType: "user",
    },
    {
      id: "19",
      size: 40,

      nodeType: "user",
    },
    {
      id: "20",
      size: 40,

      nodeType: "user",
    },
    {
      id: "21",
      size: 40,

      nodeType: "user",
    },
    {
      id: "22",
      size: 40,

      nodeType: "user",
    },
    {
      id: "23",
      size: 40,

      nodeType: "user",
    },
    {
      id: "24",
      size: 40,

      nodeType: "user",
    },
    {
      id: "25",
      size: 40,

      nodeType: "user",
    },
    {
      id: "26",
      size: 40,

      nodeType: "user",
    },
    {
      id: "27",
      size: 40,

      nodeType: "user",
    },
    {
      id: "28",
      size: 40,

      nodeType: "user",
    },
    {
      id: "29",
      size: 40,

      nodeType: "user",
    },
    {
      id: "30",
      size: 40,

      nodeType: "user",
    },
    {
      id: "31",
      size: 48,

      nodeType: "project",
    },
    {
      id: "32",
      size: 48,

      nodeType: "project",
    },
    {
      id: "33",
      size: 48,

      nodeType: "project",
    },
  ],
  edges: [
    {
      source: "0",
      target: "1",
    },
    {
      source: "0",
      target: "2",
    },
    {
      source: "0",
      target: "3",
    },
    {
      source: "0",
      target: "4",
    },
    {
      source: "0",
      target: "5",
    },
    {
      source: "0",
      target: "7",
    },
    {
      source: "0",
      target: "8",
    },
    {
      source: "0",
      target: "9",
    },
    {
      source: "0",
      target: "10",
    },
    {
      source: "0",
      target: "11",
    },
    {
      source: "0",
      target: "13",
    },
    {
      source: "0",
      target: "14",
    },
    {
      source: "0",
      target: "15",
    },
    {
      source: "0",
      target: "16",
    },
    {
      source: "2",
      target: "3",
      type: "quadratic",
    },
    {
      source: "3",
      target: "2",
      type: "quadratic",
    },
    {
      source: "4",
      target: "5",
    },
    {
      source: "4",
      target: "6",
    },
    {
      source: "5",
      target: "6",
    },
    {
      source: "7",
      target: "13",
    },
    {
      source: "8",
      target: "14",
    },
    {
      source: "9",
      target: "10",
    },

    {
      source: "10",
      target: "22",
    },
    {
      source: "10",
      target: "14",
    },
    {
      source: "10",
      target: "12",
    },
    {
      source: "10",
      target: "24",
    },
    {
      source: "10",
      target: "21",
    },
    {
      source: "10",
      target: "20",
    },
    {
      source: "11",
      target: "24",
    },
    {
      source: "11",
      target: "22",
    },
    {
      source: "11",
      target: "14",
    },
    {
      source: "12",
      target: "13",
    },
    {
      source: "16",
      target: "17",
    },
    {
      source: "16",
      target: "18",
    },
    {
      source: "16",
      target: "21",
    },
    {
      source: "16",
      target: "22",
    },
    {
      source: "17",
      target: "18",
      type: "quadratic",
    },
    {
      source: "18",
      target: "17",
      type: "quadratic",
    },
    {
      source: "17",
      target: "20",
    },
    {
      source: "18",
      target: "19",
    },
    {
      source: "19",
      target: "20",
    },
    {
      source: "19",
      target: "33",
    },
    {
      source: "19",
      target: "22",
    },
    {
      source: "19",
      target: "23",
    },
    {
      source: "20",
      target: "21",
    },
    {
      source: "21",
      target: "22",
    },
    {
      source: "22",
      target: "24",
    },
    {
      source: "22",
      target: "25",
    },
    {
      source: "22",
      target: "26",
    },
    {
      source: "22",
      target: "23",
    },
    {
      source: "22",
      target: "28",
    },
    {
      source: "22",
      target: "30",
    },
    {
      source: "22",
      target: "31",
    },
    {
      source: "22",
      target: "32",
    },
    {
      source: "22",
      target: "33",
    },
    {
      source: "23",
      target: "28",
    },
    {
      source: "23",
      target: "27",
    },
    {
      source: "23",
      target: "29",
    },
    {
      source: "23",
      target: "30",
    },
    {
      source: "23",
      target: "31",
    },
    {
      source: "23",
      target: "33",
    },
    {
      source: "32",
      target: "33",
      type: "quadratic",
    },
    {
      source: "33",
      target: "32",
      type: "quadratic",
    },
  ],
};

export default () => {
  const { t } = useTranslation();
  const [open, setIsOpen] = React.useState(false);
  const [shareLink, setShareLink] = React.useState("");
  const graphRef = React.useRef<Graph>();

  const share = () => {
    setIsOpen(true);
    setShareLink("");
  };

  const copy = async () => {
    const type = "text/plain";
    const blob = new Blob([shareLink], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    await navigator.clipboard.write(data);
    message.success(t`copy success`);
  };

  const download = async () => {
    if (!graphRef.current) return;
    const dataURL = await graphRef.current.toDataURL({
      type: "image/png",
      encoderOptions: 1,
    });
    let a: HTMLAnchorElement | null = document.createElement("a");
    a.href = dataURL;
    a.download = "test.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    a = null;
  };

  return (
    <OSGraph>
      <div className="graph-container" css={GRAPH_STYLE}>
        <div className="header">
          <div>
            <a href="/">{t`back`}</a>
            <select name="" id=""></select>
          </div>
          <div className="control">
            <button onClick={share}>{t`share`}</button>
            <button onClick={download}>{t`download`}</button>
          </div>
        </div>
        <div className="graph">
          <GraphView
            data={MOCKDAT}
            onReady={(graph) => (graphRef.current = graph)}
          />
        </div>
      </div>
      <Modal
        title={t`share link`}
        open={open}
        footer={null}
        onCancel={() => {
          setIsOpen(false);
        }}
      >
        <p>{shareLink}</p>
        <Button type="text" onClick={() => copy()}>{t`copy`}</Button>
      </Modal>
    </OSGraph>
  );
};
