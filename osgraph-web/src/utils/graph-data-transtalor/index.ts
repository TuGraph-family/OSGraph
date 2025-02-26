export const graphDataTranslator = (
  response: Record<string, any>
): Record<string, any> => {
  const changeNodeType = (data: string) => {
    let type = "";
    switch (data?.toLowerCase()) {
      case "user":
        type = "github_user";
        break;
      case "repo":
        type = "github_repo";
        break;
      case "orgnization":
        type = "github_organization";
        break;
      case "company":
        type = "company";
        break;
      case "topic":
        type = "topic";
        break;
      case "country":
        type = "country";
        break;
      default:
        type = "";
    }
    return type;
  };


  response?.data?.nodes?.forEach((item: any) => {
    item.nodeType = changeNodeType(item?.nodeType);
    item.id = item?.id?.toString();
    item.properties = {
      name: item?.name,
    };
    delete item?.type;
  });
  response?.data?.edges?.forEach((item: any) => {
    item.source = item?.source?.toString();
    item.target = item?.target?.toString();
    item.id =
      item?.source + "|" + item?.target + "|" + item?.edgeType + "|" + item?.id;
    item.properties = {
      count: item?.count || 0,
    };
    delete item?.type;
  });
  return {
    data: {
      nodes: response?.data?.nodes || [],
      edges: response?.data?.edges || [],
    },
    message: response?.message,
  };
};
