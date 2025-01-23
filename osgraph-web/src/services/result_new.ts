import request from "umi-request";
import { graphDataTranslator } from "../utils/graph-data-transtalor";

export const getExecuteShareLinkQuery = async (query: {
  templateType: string;
  path: string;
  extendsStr: string;
}) => {
  const { templateType, path, extendsStr } = query;

  const response = await request(
    `/api/graphs/${templateType}/github/${path}?${extendsStr}`,
    {
      method: "get",
    }
  );

  const res = graphDataTranslator(response);

  return res?.data;
};
