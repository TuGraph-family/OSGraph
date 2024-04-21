/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { ProjectSearch } from "../components";
import { getIsMobile } from "../utils/isMobile";
import styles from "./index.module.less";

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
  const [needFixed, setNeedFixed] = useState<boolean>(false);
  const [templateType, setTemplateType] = useState<string>("REPO_CONTRIBUTE");
  const isMobile = getIsMobile();

  const switchType = (value: number) => {
    if (value >= 980 && value <= 1580) {
      return "REPO_CONTRIBUTE";
    }
    if (value >= 1580 && value <= 2260) {
      return "REPO_ECOLOGY";
    }
    if (value >= 2260 && value <= 2940) {
      return "REPO_COMMUNITY";
    }
    if (value >= 2940 && value <= 3620) {
      return "ACCT_ACTIVITY";
    }
    if (value >= 3620 && value <= 4300) {
      return "ACCT_PARTNER";
    }
    if (value >= 4300 && value <= 4980) {
      return "ACCT_INTEREST";
    }
    return "REPO_CONTRIBUTE";
  };
  useEffect(() => {
    window.onscroll = function () {
      const { scrollHeight, clientHeight, scrollTop } =
        document.documentElement;
      setTemplateType(switchType(scrollTop));
      if (scrollTop >= 600 && !needFixed) {
        setNeedFixed(true);
      }

      if (scrollTop <= 600 || scrollHeight - clientHeight <= scrollTop + 1) {
        setNeedFixed(false);
      }
    };
    const video = document.getElementById("video") as HTMLVideoElement;
    if (video) {
      video.src =
        "https://mass-office.alipay.com/huamei_koqzbu/afts/file/FqCfRa9wOpwAAAAAAAAAABAADnV5AQBr";
      video.addEventListener("play", () => {
        video.style.visibility = "visible";
      });
    }
    const firstPage = document.getElementById("firstPage");
    if (firstPage && isMobile) {
      firstPage.style.height = "40vh";
    }
  }, []);

  return (
    <div className={styles["home"]}>
      <img
        className={styles["logo"]}
        src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*YzqCQbdW7nUAAAAAAAAAAAAADu3UAQ/original"
        alt=""
      />
      <div className={styles["home-header"]} id="firstPage">
        <video
          autoPlay
          loop
          muted
          className={styles["header-img"]}
          id="video"
          style={{ visibility: "hidden" }}
        ></video>
        <div className={styles["open-source"]}>
          <img
            src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*-GbzRqZIBdwAAAAAAAAAAAAADu3UAQ/original"
            alt=""
            className={styles["title"]}
          />
          <ProjectSearch needFixed={needFixed} templateType={templateType} />
          <div className={styles["tuGraph-icon"]}>
            <p>Powered by</p>
            <div
              className={styles["tuGraph-img"]}
              onClick={() => {
                window.open("https://www.tugraph.tech/");
              }}
            />
            <div className={styles["line"]} />
            <div
              className={styles["x-lab"]}
              onClick={() => {
                window.open("https://github.com/X-lab2017?language=shell");
              }}
            />
          </div>
          <div className={styles["text"]}>
            <p>
              探索GitHub开源图谱数据，洞察开发行为与社区生态。
              如：贡献、伙伴、兴趣、社区、生态等...
            </p>
            <div className={styles["white-strip"]} />
          </div>
        </div>
      </div>
      <div className={styles["tuGraph-project"]}>
        <div className={styles["project-body"]}>
          <div className={styles["title-left"]}>
            <div className={styles["project-info"]}>
              <img
                src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*kU6QRJfXtEQAAAAAAAAAAAAADu3UAQ/original"
                alt=""
              />
              <p className={styles["info-title"]}>项目贡献图谱</p>
            </div>
            <p className={styles["project-parse"]}>
              汇总项目在不同研发活动（Issue、PR、Commit、CR）下，贡献TopN的开发者。
            </p>
          </div>

          <img
            className={styles["tuGraphImg-right"]}
            src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*zT0VQLSlJbsAAAAAAAAAAAAADu3UAQ/original"
            alt=""
          />
        </div>
      </div>
      <div className={styles["tuGraph-project"]}>
        <div className={styles["project-body"]}>
          <img
            src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*lP8cRY59Be4AAAAAAAAAAAAADu3UAQ/original"
            alt=""
            className={styles["tuGraphImg-left"]}
          />

          <div className={styles["title-right"]} style={{ marginLeft: 60 }}>
            <div className={styles["project-info"]}>
              <img
                src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*kU6QRJfXtEQAAAAAAAAAAAAADu3UAQ/original"
                alt=""
              />
              <p className={styles["info-title"]}>项目生态图谱</p>
            </div>
            <p className={styles["project-parse"]}>
              根据项目间相同开发者对应的行为（Issue、PR、Commit、CR），依赖关系等，构建关联生态项目的TopN。
            </p>
          </div>
        </div>
      </div>
      <div className={styles["tuGraph-project"]}>
        <div className={styles["project-body"]}>
          <div className={styles["title-left"]}>
            <div className={styles["project-info"]}>
              <img
                src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*kU6QRJfXtEQAAAAAAAAAAAAADu3UAQ/original"
                alt=""
              />
              <p className={styles["info-title"]}>项目社区图谱</p>
            </div>
            <p className={styles["project-parse"]}>
              根据项目的开发者的组织、地域、关注等画像信息，汇总TopN活跃开发者。
            </p>
          </div>

          <img
            src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*xc48S731jj8AAAAAAAAAAAAADu3UAQ/original"
            alt=""
            className={styles["tuGraphImg-right"]}
          />
        </div>
      </div>
      <div className={styles["tuGraph-project"]}>
        <div className={styles["project-body"]}>
          <img
            src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*W5ogR4RO1ugAAAAAAAAAAAAADu3UAQ/original"
            alt=""
            className={styles["tuGraphImg-left"]}
          />

          <div className={styles["title-right"]} style={{ marginLeft: 60 }}>
            <div className={styles["project-info"]}>
              <img
                src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*kU6QRJfXtEQAAAAAAAAAAAAADu3UAQ/original"
                alt=""
              />
              <p className={styles["info-title"]}>开发活动图谱</p>
            </div>
            <p className={styles["project-parse"]}>
              汇总项目在不同研发活动（Issue、PR、Commit、CR）下，贡献TopN的开发者。
            </p>
          </div>
        </div>
      </div>
      <div className={styles["tuGraph-project"]}>
        <div className={styles["project-body"]}>
          <div className={styles["title-left"]}>
            <div className={styles["project-info"]}>
              <img
                src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*kU6QRJfXtEQAAAAAAAAAAAAADu3UAQ/original"
                alt=""
              />
              <p className={styles["info-title"]}>开源伙伴图谱</p>
            </div>
            <p className={styles["project-parse"]}>
              汇总和我开发活动强关联的TopN开发者。
            </p>
          </div>
          <img
            src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*2QAaRZlBAlYAAAAAAAAAAAAADu3UAQ/original"
            alt=""
            className={styles["tuGraphImg-right"]}
          />
        </div>
      </div>
      <div className={styles["tuGraph-project"]}>
        <div className={styles["project-body"]}>
          <img
            src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*iD6cRKC8RpkAAAAAAAAAAAAADu3UAQ/original"
            alt=""
            className={styles["tuGraphImg-left"]}
          />

          <div className={styles["title-right"]} style={{ marginLeft: 60 }}>
            <div className={styles["project-info"]}>
              <img
                src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*kU6QRJfXtEQAAAAAAAAAAAAADu3UAQ/original"
                alt=""
              />
              <p className={styles["info-title"]}>开源兴趣图谱</p>
            </div>
            <p className={styles["project-parse"]}>
              根据开发者参与项目的主题、标签、语言等信息，汇总TopN开源领域特征（关联TopN项目）。
            </p>
          </div>
        </div>
      </div>
      <div className={styles["home-bottom"]}>
        <img
          src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*lchoQ4PxAVAAAAAAAAAAAAAADu3UAQ/original"
          alt=""
          className={styles["os-graph"]}
        />
        <div className={styles["bottom-img"]}>
          <div
            className={styles["bottom-link"]}
            onClick={() => {
              window.open('"https://www.tugraph.org/"');
            }}
          >
            <div className={styles["tuGraph-url"]} />
          </div>

          <div
            className={styles["bottom-link"]}
            onClick={() => {
              window.open("https://github.com/TuGraph-family/OSGraph");
            }}
          >
            <div className={styles["gitHub-url"]} />
            <p>GitHub</p>
          </div>

          <div
            className={styles["bottom-link"]}
            onClick={() => {
              window.open("https://antv.antgroup.com/");
            }}
          >
            <div className={styles["antv-url"]} />
            <p>AntV</p>
          </div>
        </div>
      </div>
    </div>
  );
};
