import request from "umi-request";
import { HTTP_SERVICE_URL } from "../constants/index";

export const getListQueryTemplate = async () => {
  const response = await request(
    `${HTTP_SERVICE_URL}/tumaker/api/template/listQueryTemplate`,
    {
      method: "get"
    }
  );

  if (!response?.success) {
    return [];
  }
  return response?.data;
};

export const getExecuteFullTextQuery = async (params: {
  keyword: string;
  indexName: string;
}) => {
  const response = await request(
    `${HTTP_SERVICE_URL}/tumaker/api/template/executeFullTextQuery`,
    {
      method: "post",
      params: params
    }
  );

  if (!response?.success) {
    return [];
  }
  return response?.data;
};

export const getExecuteQueryTemplate = async (params: {
  templateId: string;
  templateParameterList?: {
    parameterName: string;
    parameterValue: string;
    valueType: string;
  };
}) => {
  const response = await request(
    `${HTTP_SERVICE_URL}/tumaker/api/template/executeQueryTemplate`,
    {
      method: "post",
      data: params
    }
  );

  return response;
};
