/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { ProjectSearch } from "../components";
import {
  ANTV,
  OSGRAPH_GITHUB,
  TUGRAPH_TECH,
  X_LAB_GITHUB
} from "../constants/links";
import { SPAPOS } from "../constants/log";
import { adjustWidth } from "../utils/adjust-width";
import { getIsMobile } from "../utils/isMobile";
import styles from "./index.module.less";

window?.Tracert?.call?.("set", {
  spmAPos: SPAPOS,
  spmBPos: location.pathname,
  pathName: "首页"
});
window?.Tracert?.call?.("logPv");

const HomePage: React.FC = () => {
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

  const toGov = () => {
    window.open("https://beian.miit.gov.cn");
  };
  useEffect(() => {
    adjustWidth();
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

    const firstPage = document.getElementById("firstPage");
    if (firstPage && isMobile) {
      firstPage.style.height = "35vh";
      firstPage.style.minHeight = "1000px";
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
          playsInline
          className={styles["header-img"]}
          id="video"
          src="https://gw.alipayobjects.com/v/huamei_tu4rvn/afts/video/A*V9DKSIe4nKEAAAAAAAAAAAAADp_eAQ"
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
                window.open(TUGRAPH_TECH);
              }}
            />
            <div className={styles["line"]} />
            <div
              className={styles["x-lab"]}
              onClick={() => {
                window.open(X_LAB_GITHUB);
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
        <div className={styles["linear"]} />
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
              发现项目核心贡献：根据项目开发者研发活动信息（Issue、PR、Commit、CR等），找到项目核心贡献者。
            </p>
          </div>

          <img
            className={styles["tuGraphImg-right"]}
            src="https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*1pkATrKdVqQAAAAAAAAAAAAADp_eAQ/original"
            alt=""
          />
        </div>
      </div>
      <div className={styles["tuGraph-project"]}>
        <div className={styles["project-body"]}>
          <img
            src="https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*QMpmRKVlVyYAAAAAAAAAAAAADp_eAQ/original"
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
              洞察项目生态伙伴：提取项目间的开发活动、组织等关联信息，构建项目核心生态关系。
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
              分析项目社区分布：根据项目的开发活动、开发者组织等信息，提取项目核心开发者社区分布。
            </p>
          </div>

          <img
            src="https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*P4PtQ79tujEAAAAAAAAAAAAADp_eAQ/original"
            alt=""
            className={styles["tuGraphImg-right"]}
          />
        </div>
      </div>
      <div className={styles["tuGraph-project"]}>
        <div className={styles["project-body"]}>
          <img
            src="https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*DtetRqhNvWQAAAAAAAAAAAAADp_eAQ/original"
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
              展示个人开源贡献：根据开发者研发活动信息（Issue、PR、Commit、CR等），找到参与的核心项目。
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
              寻找个人开源伙伴：找到开发者在开源社区中，与之协作紧密的其他开发者。
            </p>
          </div>
          <img
            src="https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*oA2_QIQQ09IAAAAAAAAAAAAADp_eAQ/original"
            alt=""
            className={styles["tuGraphImg-right"]}
          />
        </div>
      </div>
      <div className={styles["tuGraph-project"]}>
        <div className={styles["project-body"]}>
          <img
            src="https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*erDCTqGa9_MAAAAAAAAAAAAADp_eAQ/original"
            alt=""
            className={styles["tuGraphImg-left"]}
            style={{ width: 400 }}
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
              挖掘个人开源兴趣：根据参与的项目主题、标签等信息，分析开发者技术领域与兴趣。
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
              window.open(TUGRAPH_TECH);
            }}
          >
            <div className={styles["tuGraph-url"]} />
          </div>

          <div
            className={styles["bottom-link"]}
            onClick={() => {
              window.open(OSGRAPH_GITHUB);
            }}
          >
            <div className={styles["gitHub-url"]} />
            <p>GitHub</p>
          </div>

          <div
            className={styles["bottom-link"]}
            onClick={() => {
              window.open(ANTV);
            }}
          >
            <div className={styles["antv-url"]} />
            <p>AntV</p>
          </div>
        </div>
        <div className={styles["gov"]}>
          <div className={styles["gov-text"]} onClick={toGov}>
            ICP备案：京ICP备15032932号-51
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
