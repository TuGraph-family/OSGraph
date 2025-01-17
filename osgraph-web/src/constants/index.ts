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

export const GRAPH_TYPE_MAP = {
  REPO_CONTRIBUTE: "REPO_CONTRIBUTE",
  REPO_ECOLOGY: "REPO_ECOLOGY",
  REPO_COMMUNITY: "REPO_COMMUNITY",
  ACCT_ACTIVITY: "ACCT_ACTIVITY",
  ACCT_PARTNER: "ACCT_PARTNER",
  ACCT_INTEREST: "ACCT_INTEREST",
};

export const GRAPH_TYPE_CLUSTER = {
  REPO_CONTRIBUTE: "github_repo",
  REPO_ECOLOGY: "github_repo",
  REPO_COMMUNITY: "github_repo",
  ACCT_ACTIVITY: "github_user",
  ACCT_PARTNER: "github_user",
  ACCT_INTEREST: "github_user",
};

// export const EDGE_DISPLAY_NAME_MAP: Record<
//   keyof typeof EDGE_TYPE_MAP,
//   { hasCount: boolean; displayName: string; hasArrow: boolean }
// > = {
//   belong_to: {
//     displayName: "属于",
//     hasArrow: true,
//     hasCount: false,
//   },
//   comment_issue: {
//     displayName: "评论 Issue",
//     hasArrow: true,
//     hasCount: true,
//   },
//   code_review: {
//     displayName: "CR",
//     hasArrow: true,
//     hasCount: true,
//   },
//   common_developer: {
//     displayName: "共建",
//     hasArrow: false,
//     hasCount: true,
//   },
//   common_issue: {
//     displayName: "合作 Issue",
//     hasArrow: false,
//     hasCount: true,
//   },
//   common_pr: {
//     displayName: "合作 PR",
//     hasArrow: false,
//     hasCount: true,
//   },
//   common_repo: {
//     displayName: "合作项目",
//     hasArrow: false,
//     hasCount: true,
//   },
//   common_star: {
//     displayName: "共同关注",
//     hasArrow: false,
//     hasCount: true,
//   },
//   open_issue: {
//     displayName: "创建 Issue",
//     hasArrow: true,
//     hasCount: true,
//   },
//   open_pr: {
//     displayName: "创建 PR",
//     hasArrow: true,
//     hasCount: true,
//   },
//   PR: {
//     displayName: "PR",
//     hasArrow: true,
//     hasCount: true,
//   },
//   push: {
//     displayName: t("graph.submit"),
//     hasArrow: true,
//     hasCount: true,
//   },
//   repo: {
//     displayName: "参与项目",
//     hasArrow: true,
//     hasCount: true,
//   },
//   Star: {
//     displayName: "Star",
//     hasArrow: true,
//     hasCount: true,
//   },
// };

export enum GRAPH_TEMPLATE_ENUM {
  REPO_CONTRIBUTE = 1,
  REPO_ECOLOGY,
  REPO_COMMUNITY,
  ACCT_ACTIVITY,
  ACCT_PARTNER,
  ACCT_INTEREST,
}

export const GRAPH_TEMPLATE_ID_MAP = {
  [GRAPH_TEMPLATE_ENUM.REPO_CONTRIBUTE]: "项目贡献",
  [GRAPH_TEMPLATE_ENUM.REPO_ECOLOGY]: "项目生态",
  [GRAPH_TEMPLATE_ENUM.REPO_COMMUNITY]: "项目社区",
  [GRAPH_TEMPLATE_ENUM.ACCT_ACTIVITY]: "开发活动",
  [GRAPH_TEMPLATE_ENUM.ACCT_PARTNER]: "开源伙伴",
  [GRAPH_TEMPLATE_ENUM.ACCT_INTEREST]: "开源兴趣",
};

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

/** ensure unique key, use type + params */
export const GRAPH_EXTEND_PARAMS_MAP = {
  /** REPO_CONTRIBUTE */
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_CONTRIBUTE] + "start"]:
    "start-time",
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_CONTRIBUTE] + "end"]:
    "end-time",
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_CONTRIBUTE] + "repo-limit"]:
    "repo-limit",

  /** REPO_ECOLOGY */
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_ECOLOGY] + "repo-limit"]:
    "repo-limit",

  /** REPO_COMMUNITY */
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_COMMUNITY] + "country-limit"]:
    "country-limit",
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_COMMUNITY] + "company-limit"]:
    "company-limit",
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_COMMUNITY] + "user-limit"]:
    "user-limit",

  /** ACCT_ACTIVITY */
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.ACCT_ACTIVITY] + "user-limit"]:
    "user-limit",

  /** ACCT_PARTNER */
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.ACCT_PARTNER] + "user-limit"]:
    "user-limit",

  /** ACCT_INTEREST */
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.ACCT_INTEREST] + "repo-limit"]:
    "repo-limit",
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.ACCT_INTEREST] + "topic-limit"]:
    "topic-limit",
};

export const GRAPH_EXTEND_PARAMS_FORM = {
  [GRAPH_TEMPLATE_ENUM.REPO_CONTRIBUTE]: [
    {
      type: "date",
      key: "start",
      label: "params.start",
    },
    {
      type: "date",
      key: "end",
      label: "params.end",
    },
    {
      type: "inputNumber",
      key: "repo-limit",
      label: "params.contrib",
      defaultValue: 10,
    },
  ],
  [GRAPH_TEMPLATE_ENUM.REPO_ECOLOGY]: [
    {
      type: "inputNumber",
      key: "repo-limit",
      label: "params.repo",
      defaultValue: 10,
    },
  ],
  [GRAPH_TEMPLATE_ENUM.REPO_COMMUNITY]: [
    {
      type: "inputNumber",
      key: "country-limit",
      label: "params.country",
      defaultValue: 3,
    },
    {
      type: "inputNumber",
      key: "company-limit",
      label: "params.org",
      defaultValue: 3,
    },
    {
      type: "inputNumber",
      key: "user-limit",
      label: "params.contrib",
      defaultValue: 10,
    },
  ],
  [GRAPH_TEMPLATE_ENUM.ACCT_ACTIVITY]: [
    {
      type: "inputNumber",
      key: "user-limit",
      label: "params.repo",
      defaultValue: 10,
    },
  ],
  [GRAPH_TEMPLATE_ENUM.ACCT_PARTNER]: [
    {
      type: "inputNumber",
      key: "user-limit",
      label: "params.partner",
      defaultValue: 10,
    },
  ],
  [GRAPH_TEMPLATE_ENUM.ACCT_INTEREST]: [
    {
      type: "inputNumber",
      key: "repo-limit",
      label: "params.repo",
      defaultValue: 10,
    },
    {
      type: "inputNumber",
      key: "topic-limit",
      label: "params.topic",
      defaultValue: 5,
    },
  ],
};

/** limit extends params input */
export const GRAPH_LIMIT_MAP = {
  /** REPO_CONTRIBUTE */
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_CONTRIBUTE] + "start"]: {
    min: 0,
    max: 0,
  },
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_CONTRIBUTE] + "end"]: {
    min: 0,
    max: 0,
  },
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_CONTRIBUTE] + "contrib-limit"]:
    { min: 1, max: 50 },

  /** REPO_ECOLOGY */
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_ECOLOGY] + "repo-limit"]: {
    min: 1,
    max: 50,
  },

  /** REPO_COMMUNITY */
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_COMMUNITY] + "country-limit"]:
    { min: 1, max: 20 },
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_COMMUNITY] + "org-limit"]: {
    min: 1,
    max: 20,
  },
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_COMMUNITY] + "contrib-limit"]:
    { min: 1, max: 50 },

  /** ACCT_ACTIVITY */
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.ACCT_ACTIVITY] + "repo-limit"]: {
    min: 1,
    max: 50,
  },

  /** ACCT_PARTNER */
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.ACCT_PARTNER] + "partner-limit"]: {
    min: 1,
    max: 30,
  },

  /** ACCT_INTEREST */
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.ACCT_INTEREST] + "repo-limit"]: {
    min: 1,
    max: 20,
  },
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.ACCT_INTEREST] + "topic-limit"]: {
    min: 1,
    max: 20,
  },
};

/** map path params */
export const GRAPH_TEMPLATE_TYPE_MAP = {
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_CONTRIBUTE]]:
    "project-contribution",
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_ECOLOGY]]: "project-ecosystem",
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.REPO_COMMUNITY]]:
    "project-community",
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.ACCT_ACTIVITY]]:
    "develop-activity",
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.ACCT_PARTNER]]: "os-partner",
  [GRAPH_SHARE_LINK_MAP[GRAPH_TEMPLATE_ENUM.ACCT_INTEREST]]: "os-interest",
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
