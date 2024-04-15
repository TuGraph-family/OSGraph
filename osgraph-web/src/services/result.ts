import request from "umi-request";
import { HTTP_SERVICE_URL } from "../constants/index";

export const getExecuteShareQueryTemplate = async (
  templateId: string,
  params: string
) => {
  const response = await request(
    `${HTTP_SERVICE_URL}/tumaker/api/template/executeShareQueryTemplate/${templateId}/${params}`,
    {
      method: "get",
    }
  );

  if (!response?.success) {
    return [];
  }
  return response?.data;
};
