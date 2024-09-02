/**
 * file: graphs translator
 * author: Allen
*/

import { GRAPH_EXTEND_PARAMS_MAP, GRAPH_TEMPLATE_TYPE_MAP, GRAPH_SHARE_LINK_MAP, GRAPH_TEMPLATE_ENUM } from '../../constants/index';
import { dateToTimestamp } from '../../utils/date';

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

  /** map search params */
  const transUrlSearchParams = (search: string, templateType: string) => {
    const searchObj: Record<string, any> = {};
    const params = new URLSearchParams(search);
    for (const [key, value] of params) {
      if (GRAPH_EXTEND_PARAMS_MAP[templateType + key]) {
        const formatValue = ['start', 'end'].includes(key)
          ? dateToTimestamp(value)
          : value
        searchObj[GRAPH_EXTEND_PARAMS_MAP[templateType + key]] = formatValue;
      }
      else {
        searchObj[key] = value;
      }
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
