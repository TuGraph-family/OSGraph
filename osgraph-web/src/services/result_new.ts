import request from "umi-request";
import { graphDataTranslator } from "../utils/graph-data-transtalor";

export const getExecuteShareLinkQuery = async (query: {
  templateType: string;
  path: string;
  extendsStr: string;
}) => {
  const { templateType, path, extendsStr } = query;
  const key =
    templateType?.split("-")[0] === "project" ? "GitHubRepo" : "GitHubUser";

  const response = await request(
    `/api/graph/${templateType}?${key}=${encodeURIComponent(
      path
    )}&${extendsStr}`,
    {
      method: "get",
    }
  );

  const res = graphDataTranslator(response);

  return res?.data;
};
