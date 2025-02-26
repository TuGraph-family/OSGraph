/**
 * file: graphs translator
 * author: Allen
 */

import {
  GRAPH_SHARE_LINK_MAP,
} from "../../constants/index";
import {
  dateToTimestamp,
  getLast10YearsTimestampsInSeconds,
} from "../../utils/date";

const graphTranslator = () => {
  /** extract params from location.pathname */
  const extractValuesFromURL = (url: string) => {
    const pattern = /^\/graphs\/([^\/]+)\/github\/(\S+)/;
    const match = url.match(pattern);

    const adaptorHistoryTemplateType = (type: string) => {
      if (GRAPH_SHARE_LINK_MAP.repo_contribute === type) {
        return "project-contribution";
      } else if (GRAPH_SHARE_LINK_MAP.repo_ecology === type) {
        return "project-ecosystem";
      } else if (GRAPH_SHARE_LINK_MAP.repo_community === type) {
        return "project-community";
      } else if (GRAPH_SHARE_LINK_MAP.acct_activity === type) {
        return "developer-activity";
      } else if (GRAPH_SHARE_LINK_MAP.acct_partner === type) {
        return "os-partner";
      } else if (GRAPH_SHARE_LINK_MAP.acct_interest === type) {
        return "os-interest";
      }
      return type;
    };

    if (match) {
      return {
        templateType: adaptorHistoryTemplateType(match[1]),
        path: match[2],
      };
    } else {
      return { templateType: "", path: "" };
    }
  };

  /** generate url search from object */
  const objectToSearchParams = (obj: Record<string, any>): string => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        value.forEach((val) => params.append(key, val));
      } else {
        params.set(key, String(value));
      }
    }
    return params.toString();
  };



  /** map search params */
  const transUrlSearchParams = (search: string, templateType: string) => {
    const searchObj: Record<string, any> = {};
    const params = new URLSearchParams(search);
    /** Different restrictions are required according to different templateTypes */
    for (const [key, value] of params) {
      searchObj[key] = value;
    }

    /** Process contrib-repo separately and add preprocessing parameters */
    if (templateType === "project-contribution") {
      const LastYearTimestamps = getLast10YearsTimestampsInSeconds();
      /** 等到扩展参数阶段，开放用户自定义参数的功能 */
      const startDate = params.get("start-time");
      const endDate = params.get("end-time");
      let startTimestamp = LastYearTimestamps.startTimestamp;
      let endTimestamp = LastYearTimestamps.endTimestamp;

      if (startDate) {
        startTimestamp = dateToTimestamp(startDate);
      }

      if (endDate) {
        endTimestamp = dateToTimestamp(endDate);
      }

      searchObj["start-time"] = startTimestamp;
      searchObj["end-time"] = endTimestamp;
    }

    return objectToSearchParams(searchObj);
  };

  const urlValues = extractValuesFromURL(location.pathname);

  return {
    templateType: urlValues.templateType,
    path: urlValues.path,
    extendsStr: transUrlSearchParams(location.search, urlValues.templateType),
  };
};

export { graphTranslator };
