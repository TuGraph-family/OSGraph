/**
 * file: translator parameters name
 */

const translatorParamsName = (
  parameterName: string,
  parameterValue: string
) => {
  switch (parameterName) {
    case "start_timestamp":
      return Math.floor(
        (+parameterValue || new Date().setMonth(new Date().getMonth() - 120)) /
          1000
      );
    case "end_timestamp":
      return Math.floor((+parameterValue || new Date().getTime()) / 1000);
    default:
      return parameterValue;
  }
};

export { translatorParamsName };
