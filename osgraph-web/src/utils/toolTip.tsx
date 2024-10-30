// @ts-nocheck
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button, message, Space } from "antd";
import ReactDOM from "react-dom/client";
import { isEmpty } from "lodash";
import { IconFont } from "../components/icon-font";
import { NODE_TYPE_SHOW_GITHUB_LINK_MAP } from "../constants";

const renderTooltipItem = (label: string, text: string) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <div style={{ fontSize: 14, marginRight: 8 }}>
        <span>{label}</span>：<span>{text}</span>
      </div>
      <CopyToClipboard
        text={text}
        onCopy={(_, result) => {
          if (result) {
            message.success(t`copy success`);
          } else {
            message.error("复制失败，请稍后再试");
          }
        }}
      >
        <Button
          size="small"
          icon={<IconFont type="os-icon-fuzhi" />}
          type="text"
        />
      </CopyToClipboard>
    </div>
  );
};

const getTooltipContent = (record: Record<string, any>) => {
  const elementInfo = record[0];
  const { nodeType } = elementInfo;
  const showGitHubLink = NODE_TYPE_SHOW_GITHUB_LINK_MAP[nodeType];
  const properties = record[0]?.properties;
  const tooltip = document.getElementsByClassName("tooltip")[0];

  if (tooltip) {
    tooltip.style = "border-radius:16px !important";
    tooltip.style = `opacity:${isEmpty(properties) ? 0 : 1} !important`;
  }

  const nodeId = record[0]?.id;
  const isNode = Boolean(record[0]?.nodeType);
  const outDiv = document.createElement("div");

  outDiv.style.padding = "6px";
  const container = ReactDOM.createRoot(outDiv);

  /** result 页与分享页需要做区分展示 */
  const isShareRouter = window.location.href.includes("shareId");

  container.render(
    <>
      <Space direction="vertical" key={nodeId}>
        {isNode && renderTooltipItem("ID", nodeId)}
        {
          Object.keys(properties)
            // 过滤没有信息的属性
            .filter(item => properties[item] !== undefined && properties[item] !== null)
            .map((item) =>
              renderTooltipItem(item, properties[item]
            )
          )
        }
      </Space>
      {!isShareRouter && properties?.name && showGitHubLink && (
        <a
          href={`https://github.com/${properties?.name}`}
          target="_blank"
          style={{ padding: "10px 10px 4px 0", display: "block" }}
        >
          前往 Github 查看
        </a>
      )}
    </>
  );

  return outDiv;
};

export {
  renderTooltipItem,
  getTooltipContent
}
