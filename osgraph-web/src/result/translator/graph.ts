/**
 * file: graphs translator
 * author: Allen
 */

import {
  GRAPH_EXTEND_PARAMS_MAP,
  GRAPH_LIMIT_MAP,
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
        return 'project-contribution';
      }
      else if (GRAPH_SHARE_LINK_MAP.repo_ecology === type) {
        return 'project-ecosystem';
      }
      else if (GRAPH_SHARE_LINK_MAP.repo_community === type) {
        return 'project-community';
      }
      else if (GRAPH_SHARE_LINK_MAP.acct_activity === type) {
        return 'developer-activity';
      }
      else if (GRAPH_SHARE_LINK_MAP.acct_partner === type) {
        return 'os-partner';
      }
      else if (GRAPH_SHARE_LINK_MAP.acct_interest === type) {
        return 'os-interest';
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

  /** const  */
  const limitExtendsParams = (
    paramsKey: string,
    paramsValue: string | number
  ): number => {
    if (!GRAPH_LIMIT_MAP[paramsKey]) {
      return 0;
    }

    const paramsValueNumber = Number(paramsValue);

    if (Number.isNaN(paramsValueNumber)) {
      return 0;
    }

    if (paramsValueNumber > GRAPH_LIMIT_MAP[paramsKey].max) {
      return GRAPH_LIMIT_MAP[paramsKey].max;
    } else if (paramsValueNumber < GRAPH_LIMIT_MAP[paramsKey].min) {
      return GRAPH_LIMIT_MAP[paramsKey].min;
    } else {
      return paramsValueNumber;
    }
  };

  /** map search params */
  const transUrlSearchParams = (search: string, templateType: string) => {
    const searchObj: Record<string, any> = {};
    const params = new URLSearchParams(search);
    /** 根据不同的 templateType 需要做不同的限制 */
    for (const [key, value] of params) {
      if (GRAPH_EXTEND_PARAMS_MAP[templateType + key]) {
        searchObj[GRAPH_EXTEND_PARAMS_MAP[templateType + key]] =
          limitExtendsParams(templateType + key, value);
      } else {
        searchObj[key] = value;
      }
    }

    /** 单独处理 contrib-repo，添加预处理参数 */
    if (
      templateType === 'project-contribution'
    ) {
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

  console.log('urlValues:', urlValues);

  return {
    templateType: urlValues.templateType,
    path: urlValues.path,
    extendsStr: transUrlSearchParams(
      location.search,
      urlValues.templateType,
    ),
  };
};

export { graphTranslator };
