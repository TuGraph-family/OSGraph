/**
 * file: translator template list
 * author: Allen
*/

import { translatorParamsName } from './transParamsName';

const TranslatorTemplateList = (templateList: any, value: string) => {
  return templateList.map(
    (item: {
      parameterName: string;
      parameterValue: string;
      valueType: string;
    }) => {
      const { parameterName, parameterValue, valueType } = item;
      return {
        parameterName: parameterName,
        parameterValue: translatorParamsName(parameterName, parameterValue || value),
        valueType: valueType,
      };
    }
  );
};

export { TranslatorTemplateList };
