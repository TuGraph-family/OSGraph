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
  "#17C76F"
];

// const HTTP_SERVICE_URL = `${window.location.protocol}//${window.location.hostname}:9000`;
export const HTTP_SERVICE_URL = `http://47.108.139.230:9000`;

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
  code_review: "code_review"
};

export const NODE_TYPE_MAP = {
  github_repo: "github_repo",
  github_organization: "github_organization",
  company: "company",
  github_user: "github_user",
  topic: "topic",
  country: "country"
};

export const NODE_TYPE_COLOR_MAP: Record<
  keyof typeof NODE_TYPE_MAP,
  string | string[]
> = {
  company: "#00c9c9",
  country: "#f08f56",
  github_organization: "#00c9c9",
  github_user: ["#1783ff", "#7863ff", "#db9d0d", "#b4c8ed"],
  github_repo: "#d580ff",
  topic: "#ff80ca"
};

export const NODE_TYPE_ICON_MAP: Record<keyof typeof NODE_TYPE_MAP, string> = {
  github_organization: "company",
  country: "country",
  github_repo: "github_repo",
  company: "company",
  topic: "topic",
  github_user: "user"
};

export const EDGE_DISPLAY_NAME_MAP: Record<
  keyof typeof EDGE_TYPE_MAP,
  { hasCount: boolean; displayName: string; hasArrow: boolean }
> = {
  belong_to: {
    displayName: "属于",
    hasArrow: true,
    hasCount: false
  },
  comment_issue: {
    displayName: "评论 Issue",
    hasArrow: true,
    hasCount: true
  },
  code_review: {
    displayName: "CR",
    hasArrow: true,
    hasCount: true
  },
  common_developer: {
    displayName: "共建",
    hasArrow: false,
    hasCount: true
  },
  common_issue: {
    displayName: "合作 Issue",
    hasArrow: false,
    hasCount: true
  },
  common_pr: {
    displayName: "合作 PR",
    hasArrow: false,
    hasCount: true
  },
  common_repo: {
    displayName: "合作项目",
    hasArrow: false,
    hasCount: true
  },
  common_star: {
    displayName: "共同关注",
    hasArrow: false,
    hasCount: true
  },
  open_issue: {
    displayName: "创建 Issue",
    hasArrow: true,
    hasCount: true
  },
  open_pr: {
    displayName: "创建 PR",
    hasArrow: true,
    hasCount: true
  },
  PR: {
    displayName: "PR",
    hasArrow: true,
    hasCount: true
  },
  push: {
    displayName: "提交",
    hasArrow: true,
    hasCount: true
  },
  repo: {
    displayName: "参与项目",
    hasArrow: true,
    hasCount: true
  },
  Star: {
    displayName: "Star",
    hasArrow: true,
    hasCount: true
  }
};
