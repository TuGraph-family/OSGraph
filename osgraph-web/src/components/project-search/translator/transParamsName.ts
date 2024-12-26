/**
 * file: translator parameters name
 */

const translatorParamsName = (
  parameterName: string,
  parameterValue: string,
  defaultValue: string
) => {
  switch (parameterName) {
    case "start-time":
      return Math.floor(
        (+parameterValue || new Date().setMonth(new Date().getMonth() - 120)) /
          1000
      );
    case "end-time":
      return Math.floor((+parameterValue || new Date().getTime()) / 1000);
    default:
      return parameterValue || defaultValue;
  }
};

export { translatorParamsName };
