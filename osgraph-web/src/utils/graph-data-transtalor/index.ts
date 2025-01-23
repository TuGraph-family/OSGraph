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

  const changeEdgeType = (data: string) => {
    let type = "";
    switch (data) {
      case "CommitAction":
        type = "push";
        break;
      case "CreatePR":
        type = "open_pr";
        break;
      case "CodeReviewAction":
        type = "code_review";
        break;
      case "CreateIssue":
        type = "open_issue";
        break;
      case "CommentIssue":
        type = "comment_issue";
        break;
      case "Belong":
        type = "belong_to";
        break;
      case "PullRequestAction":
        type = "PR";
        break;
      case "Star":
        type = "Star";
        break;
      case "CommonDevelop":
        type = "common_developer";
        break;
      case "CommonIssue":
        type = "common_issue";
        break;
      case "CommonPR":
        type = "common_pr";
        break;
      case "CommonStar":
        type = "common_star";
        break;
      case "CommonRepo":
        type = "common_repo";
        break;
      case "ContributeRepo":
        type = "common_repo";
        break;
      case "OpenPR":
        type = "open_pr";
        break;
      case "Push":
        type = "push";
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
    item.edgeType = changeEdgeType(item?.edgeType);
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
