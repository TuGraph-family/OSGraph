/**
 * file: graphs translator
 * author: Allen
 */

import {
  GRAPH_EXTEND_PARAMS_MAP,
  GRAPH_TEMPLATE_TYPE_MAP,
  GRAPH_SHARE_LINK_MAP,
  GRAPH_LIMIT_MAP,
  GRAPH_TEMPLATE_ENUM,
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

    if (match) {
      return {
        templateType: GRAPH_TEMPLATE_TYPE_MAP[match[1]],
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
    /** Different restrictions are required according to different templateTypes */
    for (const [key, value] of params) {
      if (GRAPH_EXTEND_PARAMS_MAP[templateType + key]) {
        searchObj[GRAPH_EXTEND_PARAMS_MAP[templateType + key]] =
          limitExtendsParams(templateType + key, value);
      } else {
        searchObj[key] = value;
      }
    }

    /** Process contrib-repo separately and add preprocessing parameters */
    if (
      templateType === GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_CONTRIBUTE]
    ) {
      const LastYearTimestamps = getLast10YearsTimestampsInSeconds();
      /** Wait until the extended parameter stage to open the function of user-defined parameters. */
      const startDate = params.get("start");
      const endDate = params.get("end");
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
    extendsStr: transUrlSearchParams(
      location.search,
      GRAPH_SHARE_LINK_MAP[urlValues.templateType]
    ),
  };
};

export { graphTranslator };
