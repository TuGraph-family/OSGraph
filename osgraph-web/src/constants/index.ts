export const NODE_SIZE_RANGE = [16, 80];
export const NODE_COLORS = [
  "#99ADD1",
  "#1783FF",
  "#00C9C9",
  "#F08F56",
  "#D580FF",
  "#7863FF",
  "#DB9D0D",
  "#60C42D",
  "#FF80CA",
  "#2491B3",
  "#17C76F",
];

export const EDGE_TYPE_MAP = {
  belong_to: "belong_to",
  comment_issue: "comment_issue",
  common_developer: "common_developer",
  common_issue: "common_issue",
  common_pr: "common_pr",
  common_repo: "common_repo",
  common_star: "common_star",
  open_issue: "open_issue",
  open_pr: "open_pr",
  PR: "PR",
  push: "push",
  repo: "repo",
  Star: "Star",
  code_review: "code_review",
};

export const NODE_TYPE_MAP = {
  github_repo: "github_repo",
  github_organization: "github_organization",
  company: "company",
  github_user: "github_user",
  topic: "topic",
  country: "country",
  github_user_3d: "github_user_3d",
};
export const NODE_TYPE_SHOW_GITHUB_LINK_MAP = {
  github_repo: true,
  github_organization: true,
  company: false,
  github_user: true,
  topic: false,
  country: false,
};

export const NODE_TYPE_COLOR_MAP: Record<
  keyof typeof NODE_TYPE_MAP,
  string | string[]
> = {
  company: "#00c9c9",
  country: "#f08f56",
  github_organization: "#00c9c9",
  github_user: ["#db9d0d", "#17C76F", "#1783ff", "#7863ff"],
  github_user_3d: "#faebd7",
  github_repo: "#d580ff",
  topic: "#ff80ca",
};

export const NODE_TYPE_ICON_MAP: Record<keyof typeof NODE_TYPE_MAP, string> = {
  github_organization: "company",
  country: "country",
  github_repo: "github_repo",
  company: "company",
  topic: "topic",
  github_user: "user",
  github_user_3d: "user",
};

export enum GRAPH_TEMPLATE_ENUM {
  REPO_CONTRIBUTE = 1,
  REPO_ECOLOGY,
  REPO_COMMUNITY,
  ACCT_ACTIVITY,
  ACCT_PARTNER,
  ACCT_INTEREST,
}

export const GRAPH_SHARE_LINK_MAP: Record<string, string> = {
  [GRAPH_TEMPLATE_ENUM.REPO_CONTRIBUTE]: "repo-contrib",
  [GRAPH_TEMPLATE_ENUM.REPO_ECOLOGY]: "repo-eco",
  [GRAPH_TEMPLATE_ENUM.REPO_COMMUNITY]: "repo-community",
  [GRAPH_TEMPLATE_ENUM.ACCT_ACTIVITY]: "dev-activity",
  [GRAPH_TEMPLATE_ENUM.ACCT_PARTNER]: "dev-partner",
  [GRAPH_TEMPLATE_ENUM.ACCT_INTEREST]: "dev-interest",
  repo_contribute: "repo-contrib",
  repo_ecology: "repo-eco",
  repo_community: "repo-community",
  acct_activity: "dev-activity",
  acct_partner: "dev-partner",
  acct_interest: "dev-interest",
};

/** map template type document.title */
export const GRAPH_DOCUMENT_TITLE_MAP = {
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_CONTRIBUTE]]:
    "OSGraph - Project Contribution Graph",
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_ECOLOGY]]:
    "OSGraph - Project Ecosystem Graph",
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_COMMUNITY]]:
    "OSGraph - Project Community Graph",
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.ACCT_ACTIVITY]]:
    "OSGraph - Developer Activity Graph",
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.ACCT_PARTNER]]:
    "OSGraph - Open-source Partner Graph",
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.ACCT_INTEREST]]:
    "OSGraph - Open-source Interest Graph",
};
export const GRAPH_QUERY_SOURCE_MAP: Record<string, string> = {
  github_repo: "github-repo",
  github_user: "github-user",
};

export const MAX_INVALID_TIME = 30000;


export const HIDDEN_END_ARROW_TYPE = ['CommonDevelop', 'CommonIssue', 'CommonPR', 'CommonRepo', 'ContributeRepo', 'CommonStar']
