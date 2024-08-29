import request from "umi-request";

export const getExecuteShareQueryTemplate = async (
  templateId: string,
  params: string
) => {
  const response = await request(
    `/tumaker/api/template/executeShareQueryTemplate/${templateId}/${params}`,
    {
      method: "get"
    }
  );

  if (!response?.success) {
    return [];
  }
  return response?.data;
};

export const getExecuteShareLinkQuery = async(query: {
  templateType: string;
  path: string;
  extendsStr: string;
}) => {
  const { templateType, path, extendsStr } = query;
  const response = await request(
    `/tumaker/api/template/executeShareQueryTemplate/v2/${templateType}/github/${path}?${extendsStr}`,
    {
      method: "get"
    }
  );

  if (!response?.success) {
    return [];
  }
  return response?.data;
};

