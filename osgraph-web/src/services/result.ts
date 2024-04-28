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
