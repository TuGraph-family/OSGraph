/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProjectSearch } from "../components";
import Language from "../components/language";
import { getUrlParams } from "../utils";
import {
  ANTV,
  OSGRAPH_GITHUB,
  TUGRAPH_TECH,
  X_LAB_GITHUB,
} from "../constants/links";
import { getIsMobile } from "../utils/isMobile";
import styles from "./index.module.less";

const HomePage: React.FC = () => {
  const [needFixed, setNeedFixed] = useState<boolean>(false);
  const [templateType, setTemplateType] = useState<string>("REPO_CONTRIBUTE");
  const isMobile = getIsMobile();
  const { t, i18n } = useTranslation();

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
    const lang = getUrlParams("lang") || "zh-CN";
    i18n.changeLanguage(lang === "en-US" ? "en" : "zh");
  }, []);

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
    const video = document.getElementById("video") as HTMLVideoElement;
    if (video) {
      video.src =
        "https://gw.alipayobjects.com/v/huamei_tu4rvn/afts/video/A*V9DKSIe4nKEAAAAAAAAAAAAADp_eAQ";
      video.addEventListener("play", () => {
        video.style.visibility = "visible";
      });
    }
    const firstPage = document.getElementById("firstPage");
    if (firstPage && isMobile) {
      firstPage.style.height = "35vh";
      firstPage.style.minHeight = "1000px";
    }
  }, []);

  const imgList = useMemo(() => {
    return i18n.language === "en"
      ? [
          "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*9vxoSI3Rm0IAAAAAAAAAAAAADp_eAQ/original",
          "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*3CNASKuv-SkAAAAAAAAAAAAADp_eAQ/original",
          "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*9KxVQIWeoMMAAAAAAAAAAAAADp_eAQ/original",
          "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*WHt9R5DepBYAAAAAAAAAAAAADp_eAQ/original",
          "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*nN72RLT2HXMAAAAAAAAAAAAADp_eAQ/original",
          "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*cIgUTpIp3AEAAAAAAAAAAAAADp_eAQ/original",
        ]
      : [
          "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*1pkATrKdVqQAAAAAAAAAAAAADp_eAQ/original",
          "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*QMpmRKVlVyYAAAAAAAAAAAAADp_eAQ/original",
          "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*P4PtQ79tujEAAAAAAAAAAAAADp_eAQ/original",
          "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*DtetRqhNvWQAAAAAAAAAAAAADp_eAQ/original",
          "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*oA2_QIQQ09IAAAAAAAAAAAAADp_eAQ/original",
          "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*erDCTqGa9_MAAAAAAAAAAAAADp_eAQ/original",
        ];
  }, [i18n.language]);

  return (
    <div className={styles["home"]}>
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: 99 }}>
        <Language />
      </div>
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
            <p>{t("home.desc")}</p>
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
              <p className={styles["info-title"]}>{t("home.project.title1")}</p>
            </div>
            <p className={styles["project-parse"]}>{t("home.project.desc1")}</p>
          </div>

          <img className={styles["tuGraphImg-right"]} src={imgList[0]} alt="" />
        </div>
      </div>
      <div className={styles["tuGraph-project"]}>
        <div className={styles["project-body"]}>
          <img src={imgList[1]} alt="" className={styles["tuGraphImg-left"]} />

          <div className={styles["title-right"]} style={{ marginLeft: 60 }}>
            <div className={styles["project-info"]}>
              <img
                src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*kU6QRJfXtEQAAAAAAAAAAAAADu3UAQ/original"
                alt=""
              />
              <p className={styles["info-title"]}>{t("home.project.title2")}</p>
            </div>
            <p className={styles["project-parse"]}>{t("home.project.desc2")}</p>
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
              <p className={styles["info-title"]}>{t("home.project.title3")}</p>
            </div>
            <p className={styles["project-parse"]}>{t("home.project.desc3")}</p>
          </div>

          <img src={imgList[2]} alt="" className={styles["tuGraphImg-right"]} />
        </div>
      </div>
      <div className={styles["tuGraph-project"]}>
        <div className={styles["project-body"]}>
          <img src={imgList[3]} alt="" className={styles["tuGraphImg-left"]} />

          <div className={styles["title-right"]} style={{ marginLeft: 60 }}>
            <div className={styles["project-info"]}>
              <img
                src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*kU6QRJfXtEQAAAAAAAAAAAAADu3UAQ/original"
                alt=""
              />
              <p className={styles["info-title"]}>{t("home.project.title4")}</p>
            </div>
            <p className={styles["project-parse"]}>{t("home.project.desc4")}</p>
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
              <p className={styles["info-title"]}>{t("home.project.title5")}</p>
            </div>
            <p className={styles["project-parse"]}>{t("home.project.desc5")}</p>
          </div>
          <img src={imgList[4]} alt="" className={styles["tuGraphImg-right"]} />
        </div>
      </div>
      <div className={styles["tuGraph-project"]}>
        <div className={styles["project-body"]}>
          <img
            src={imgList[5]}
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
              <p className={styles["info-title"]}>{t("home.project.title6")}</p>
            </div>
            <p className={styles["project-parse"]}>{t("home.project.desc6")}</p>
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
