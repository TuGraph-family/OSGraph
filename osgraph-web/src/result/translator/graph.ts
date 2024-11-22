/**
 * file: graphs translator
 * author: Allen
*/

import { GRAPH_EXTEND_PARAMS_MAP, GRAPH_TEMPLATE_TYPE_MAP, GRAPH_SHARE_LINK_MAP, GRAPH_LIMIT_MAP, GRAPH_TEMPLATE_ENUM } from '../../constants/index';
import { getLast10YearsTimestampsInSeconds } from '../../utils/date';

const graphTranslator = () => {

  /** extract params from location.pathname */
  const extractValuesFromURL = (url: string) => {
    const pattern = /^\/graphs\/([^\/]+)\/github\/(\S+)/;
    const match = url.match(pattern);

    if (match) {
      return { templateType: GRAPH_TEMPLATE_TYPE_MAP[match[1]], path: match[2] };
    }
    else {
      return { templateType: '', path: '' };
    }
  }

  /** generate url search from object */
  const objectToSearchParams = (obj: Record<string, any>): string => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        value.forEach(val => params.append(key, val));
      }
      else {
        params.set(key, String(value));
      }
    }
    return params.toString();
  }

  /** const  */
  const limitExtendsParams = (paramsKey: string, paramsValue: string | number): number => {

    if (!GRAPH_LIMIT_MAP[paramsKey]) {
      return 0;
    }

    const paramsValueNumber = Number(paramsValue);

    if (Number.isNaN(paramsValueNumber)) {
      return 0;
    }

    if (paramsValueNumber > GRAPH_LIMIT_MAP[paramsKey].max) {
      return GRAPH_LIMIT_MAP[paramsKey].max;
    }
    else if (paramsValueNumber < GRAPH_LIMIT_MAP[paramsKey].min) {
      return GRAPH_LIMIT_MAP[paramsKey].min;
    }
    else {
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
        searchObj[GRAPH_EXTEND_PARAMS_MAP[templateType + key]] = limitExtendsParams(templateType + key, value);
      }
      else {
        searchObj[key] = value;
      }
    }

    /** 单独处理 contrib-repo，添加预处理参数 */
    if (templateType === GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_CONTRIBUTE]) {
      const LastYearTimestamps = getLast10YearsTimestampsInSeconds();
      /** 等到扩展参数阶段，开放用户自定义参数的功能 */
      // const startDate = params.get('start');
      // const endDate = params.get('end');
      let startTimestamp = LastYearTimestamps.startTimestamp;
      let endTimestamp = LastYearTimestamps.endTimestamp;

      // if (startDate) {
      //   startTimestamp = dateToTimestamp(startDate);
      // }
      
      // if (endDate) { 
      //   endTimestamp = dateToTimestamp(endDate);
      // }
      
      searchObj['start_timestamp'] = startTimestamp;
      searchObj['end_timestamp'] = endTimestamp;
    }

    return objectToSearchParams(searchObj);
  }

  const urlValues = extractValuesFromURL(location.pathname);
 
  return {
    templateType: urlValues.templateType,
    path: urlValues.path,
    extendsStr: transUrlSearchParams(location.search, GRAPH_SHARE_LINK_MAP[urlValues.templateType]),
  }
};

export { graphTranslator };
