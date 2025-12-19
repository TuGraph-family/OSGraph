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
import moment from "moment";
import { MAX_INVALID_TIME } from "../constants";


const HomePage: React.FC = () => {
  const [queryList, setQueryList] = useState<any[]>([]);
  const [needFixed, setNeedFixed] = useState<boolean>(false);
  const [templateIndex, setTemplateIndex] = useState<number>(0);
  const isMobile = getIsMobile();
  const { t, i18n } = useTranslation();

  const switchType = (value: number) => {
    switch (true) {
      case value >= 980 && value <= 1580:
        return 0;
      case value >= 1580 && value <= 2260:
        return 1;
      case value >= 2260 && value <= 2940:
        return 2;
      case value >= 2940 && value <= 3620:
        return 3;
      case value >= 3620 && value <= 4300:
        return 4;
      case value >= 4300 && value <= 4980:
        return 5;
      default:
        return 0;
    }
  };

  const toGov = () => {
    window.open("https://beian.miit.gov.cn");
  };

  useEffect(() => {
    window.Tracert?.call?.('expo', 'a4378.b118745.c400963', '');
    const startTime = moment().valueOf();
    let invalidTimes: number = 0
    let departureTime: number | null = null

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        departureTime = moment().valueOf();
      } else if (document.visibilityState === 'visible') {
        if (departureTime) {
          if ((moment().valueOf() - departureTime) > MAX_INVALID_TIME) {
            invalidTimes += moment().valueOf() - departureTime
          }
          departureTime = null
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    const unload = () => {
      const residence_time = moment().valueOf() - startTime - invalidTimes;
      if (residence_time > 1000) {
        window?.Tracert?.call?.("set", {
          spmAPos: 'a4378',
          spmBPos: 'b118745',
          pathName: "首页"
        });
        window?.Tracert?.call?.("logPv", { residence_time });
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', unload);
    }

    window.addEventListener('beforeunload', unload);

    return unload
  }, [])


  useEffect(() => {
    const lang = getUrlParams("lang") || "zh-CN";
    i18n.changeLanguage(lang === "en-US" ? "en" : "zh");
  }, []);

  useEffect(() => {
    window.onscroll = function () {
      const { scrollHeight, clientHeight, scrollTop } =
        document.documentElement;
      setTemplateIndex(switchType(scrollTop));
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
        "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*9KxVQIWeoMMAAAAAAAAAAAAADp_eAQ/original",
        "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*3CNASKuv-SkAAAAAAAAAAAAADp_eAQ/original",
        "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*WHt9R5DepBYAAAAAAAAAAAAADp_eAQ/original",
        "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*nN72RLT2HXMAAAAAAAAAAAAADp_eAQ/original",
        "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*cIgUTpIp3AEAAAAAAAAAAAAADp_eAQ/original",
      ]
      : [
        "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*1pkATrKdVqQAAAAAAAAAAAAADp_eAQ/original",
        "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*P4PtQ79tujEAAAAAAAAAAAAADp_eAQ/original",
        "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*QMpmRKVlVyYAAAAAAAAAAAAADp_eAQ/original",
        "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*DtetRqhNvWQAAAAAAAAAAAAADp_eAQ/original",
        "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*oA2_QIQQ09IAAAAAAAAAAAAADp_eAQ/original",
        "https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*erDCTqGa9_MAAAAAAAAAAAAADp_eAQ/original",
      ];
  }, [i18n.language]);

  const renderProjectList = () => {
    return <>
      {
        queryList?.map((item, idx) => {
          const isOdd = idx % 2 === 0
          return <div className={styles["tuGraph-project"]} key={item?.id}>
            <div className={styles["project-body"]} style={{ flexDirection: isOdd ? 'row' : 'row-reverse' }}>
              <div className={styles["title"]}>
                <div className={styles["project-info"]}>
                  <img
                    src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*kU6QRJfXtEQAAAAAAAAAAAAADu3UAQ/original"
                    alt=""
                  />
                  <p className={styles["info-title"]}>{item?.name + t("home.graph")}</p>
                </div>
                <p className={styles["project-parse"]}>{item?.comment}</p>
              </div>
              <img className={styles["tuGraphImg"]} src={imgList[idx]} alt="" />
            </div>
          </div>
        }
        )
      }
    </>
  };

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
          style={{ visibility: "hidden" }}
        ></video>
        <div className={styles["open-source"]}>
          <img
            src="https://mdn.alipayobjects.com/huamei_0bwegv/afts/img/A*-GbzRqZIBdwAAAAAAAAAAAAADu3UAQ/original"
            alt=""
            className={styles["title"]}
          />
          <ProjectSearch needFixed={needFixed} templateIndex={templateIndex} spmD="b118745.c400963.d535120" getQueryList={(queryList) => setQueryList(queryList)} />
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
            <div
              className={styles["gitHub"]}
              onClick={() => {
                window.open(OSGRAPH_GITHUB);
              }}
            >
              <div className={styles["gitHub-url"]} />
              <p>GitHub</p>
            </div>
          </div>
          <div className={styles["text"]}>
            <p>{t("home.desc")}</p>
            <div className={styles["white-strip"]} />
          </div>
        </div>
        <div className={styles["linear"]} />
      </div>
      {renderProjectList()}
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
          <img src='https://mdn.alipayobjects.com/huamei_tu4rvn/afts/img/A*Ky0xT5cjEkAAAAAAQBAAAAgAep_eAQ/original' />
          <a className={styles["gov-text"]} href="https://beian.mps.gov.cn/#/query/webSearch?code=11010802047078" rel="noreferrer" target="_blank">京公网安备11010802047078号</a>
          <div className={styles["gov-text"]} onClick={toGov}>
            ICP备案：京ICP备15032932号-51
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
