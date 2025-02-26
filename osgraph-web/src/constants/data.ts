import { TFunction } from "i18next";
import { EDGE_TYPE_MAP } from ".";

export const getPlaceholder = (t: TFunction): Record<string, string> => {
  return {
    github_repo: t("home.repository-placeholder"),
    github_user: t("home.account-placeholder"),
  };
};


export const GET_EDGE_DISPLAY_NAME_MAP = (
  t: TFunction
): Record<
  keyof typeof EDGE_TYPE_MAP,
  { hasCount: boolean; displayName: string; hasArrow: boolean }
> => {
  return {
    belong_to: {
      displayName: t("graph.edge.desc9"),
      hasArrow: true,
      hasCount: false,
    },
    comment_issue: {
      displayName: t("graph.edge.desc7"),
      hasArrow: true,
      hasCount: true,
    },
    code_review: {
      displayName: t("graph.edge.desc4"),
      hasArrow: true,
      hasCount: true,
    },
    common_developer: {
      displayName: t("graph.edge.desc8"),
      hasArrow: false,
      hasCount: true,
    },
    common_issue: {
      displayName: t("graph.edge.desc10"),
      hasArrow: false,
      hasCount: true,
    },
    common_pr: {
      displayName: t("graph.edge.desc11"),
      hasArrow: false,
      hasCount: true,
    },
    common_repo: {
      displayName: t("graph.edge.desc12"),
      hasArrow: false,
      hasCount: true,
    },
    common_star: {
      displayName: t("graph.edge.desc13"),
      hasArrow: false,
      hasCount: true,
    },
    open_issue: {
      displayName: t("graph.edge.desc1"),
      hasArrow: true,
      hasCount: true,
    },
    open_pr: {
      displayName: t("graph.edge.desc2"),
      hasArrow: true,
      hasCount: true,
    },
    PR: {
      displayName: t("graph.edge.desc5"),
      hasArrow: true,
      hasCount: true,
    },
    push: {
      displayName: t("graph.edge.desc3"),
      hasArrow: true,
      hasCount: true,
    },
    repo: {
      displayName: t("graph.edge.desc14"),
      hasArrow: true,
      hasCount: true,
    },
    Star: {
      displayName: t("graph.edge.desc6"),
      hasArrow: true,
      hasCount: true,
    },
  };
};
