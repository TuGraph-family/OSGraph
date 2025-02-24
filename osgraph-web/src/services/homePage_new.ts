import request from "umi-request";
import { GRAPH_TEMPLATE_ID_MAP } from "../constants";
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
    item.templateName = item.name;
    item.templateParameterList = parseStringToObjects(item.filter_keys).map(
      (item: any) => {
        return {
          parameterName: item.key,
          parameterValue: ["start-time", "end-time"].includes(item.key)
            ? ""
            : item.default,
          valueType: item.type,
        };
      }
    );

    if (item.input_types === "user") {
      item.querySource = "github_user";
    }
    if (item.input_types === "repo") {
      item.querySource = "github_repo";
    }

    switch (item.name) {
      case "项目贡献":
      case "Project Contribution":
        item.templateType = "REPO_CONTRIBUTE";
        item.id = 1;
        break;
      case "项目生态":
      case "Project Ecosystem":
        item.templateType = "REPO_ECOLOGY";
        item.id = 2;
        break;
      case "项目社区":
      case "Project Community":
        item.templateType = "REPO_COMMUNITY";
        item.id = 3;
        break;
      case "开发活动":
      case "Developer Activity":
        item.templateType = "ACCT_ACTIVITY";
        item.id = 4;
        break;
      case "开源伙伴":
      case "Open-source Partner":
        item.templateType = "ACCT_PARTNER";
        item.id = 5;
        break;
      case "开源兴趣":
      case "Open-source Interest":
        item.templateType = "ACCT_INTEREST";
        item.id = 6;
        break;
      default:
        item.templateType = "";
    }
    return item;
  });
  return data?.sort((a: any, b: any) => a.id - b.id);
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
  templateId: string;
  value: any;
  templateParameterList: any;
}) => {
  let url = "";
  let args: any = {};
  const templateName =
    GRAPH_TEMPLATE_ID_MAP[
    +params.templateId as keyof typeof GRAPH_TEMPLATE_ID_MAP
    ];
  if (templateName === "项目贡献") {
    url = `/api/graphs/project-contribution/github/${params.value}`;
    args = {};
    params.templateParameterList.forEach((item: any) => {
      args[item.parameterName] = item.parameterValue;
    });
  }
  if (templateName === "项目社区") {
    url = `/api/graphs/project-community/github/${params.value}`;
    args = {};
    params.templateParameterList.forEach((item: any) => {
      args[item.parameterName] = item.parameterValue;
    });
  }

  if (templateName === "项目生态") {
    url = `/api/graphs/project-ecosystem/github/${params.value}`;
    args = {};
    params.templateParameterList.forEach((item: any) => {
      args[item.parameterName] = item.parameterValue;
    });
  }

  if (templateName === "开发活动") {
    url = `/api/graphs/developer-activity/github/${params.value}`;
    args = {};
    params.templateParameterList.forEach((item: any) => {
      args[item.parameterName] = item.parameterValue;
    });
  }

  if (templateName === "开源伙伴") {
    url = `/api/graphs/os-partner/github/${params.value}`;
    args = {};
    params.templateParameterList.forEach((item: any) => {
      args[item.parameterName] = item.parameterValue;
    });
  }

  if (templateName === "开源兴趣") {
    url = `/api/graphs/os-interest/github/${params.value}`;
    args = {};
    params.templateParameterList.forEach((item: any) => {
      args[item.parameterName] = item.parameterValue;
    });
  }

  const response = await request(url, {
    method: "get",
    params: args,
  });

  const res = graphDataTranslator(response);
  if (response?.status === 0) {
    res.success = true;
  }
  return res;
};
