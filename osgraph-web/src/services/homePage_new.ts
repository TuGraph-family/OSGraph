import request from "umi-request";
import { graphDataTranslator } from "../utils/graph-data-transtalor";

function parseStringToObjects(inputStr: string) {
  if (typeof inputStr !== "string") {
    throw new TypeError("输入必须是一个字符串");
  }

  const parts = inputStr.split(";").filter((part) => part.trim() !== "");

  const result = parts.map((part) => {
    const obj: any = {};
    const keyValuePairs = part.split(",").filter((pair) => pair.trim() !== "");

    keyValuePairs.forEach((pair) => {
      const [key, value] = pair.split(":").map((str) => str.trim());
      let parsedValue;
      if (/^-?\d+(\.\d+)?$/.test(value)) {
        parsedValue = Number(value);
      } else if (/^(true|false)$/i.test(value)) {
        parsedValue = value.toLowerCase() === "true";
      } else {
        parsedValue = value.replace(/^"(.+)"$/, "$1");
      }
      obj[key] = parsedValue;
    });

    return obj;
  });

  return result;
}

export const getListQueryTemplate = async () => {
  const response = await request(`/api/graphs/list`, {
    method: "get",
  });

  if (response?.status === 1) {
    return [];
  }
  let data = response?.data?.map((item: any) => {
    item.templateParameterList = parseStringToObjects(item.filter_keys).map(
      (item: any) => {
        return {
          parameterName: item.key,
          parameterValue: item.default,
          valueType: item.type,
        };
      }
    );
    return item;
  });
  return data
};

export const getExecuteFullTextQuery = async (params: {
  keyword: string;
  indexName: string;
}) => {
  const response = await request(`/api/graphs/fulltext-search`, {
    method: "get",
    params: params,
  });

  if (response?.status === 1) {
    return [];
  }
  let data = response?.data || [];
  const uniqueDataForOf = [];
  const seenIdsForOf = new Set();

  for (const item of data) {
    item.id = item.name;
    if (!seenIdsForOf.has(item.id)) {
      seenIdsForOf.add(item.id);
      uniqueDataForOf.push(item);
    }
  }

  return uniqueDataForOf;
};

export const getExecuteQueryTemplate = async (params: {
  path: string;
  value: any;
  templateParameterList: any;
}) => {
  let args: any = {};
  params.templateParameterList.forEach((item: any) => {
    args[item.parameterName] = item.parameterValue;
  });

  const response = await request(`/api/graphs/${params.path}/github/${params.value}`, {
    method: "get",
    params: args,
  });

  const res = graphDataTranslator(response);
  if (response?.status === 0) {
    res.success = true;
  }
  return res;
};
