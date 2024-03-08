/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useTranslation } from "react-i18next";

export default () => {
  const { t } = useTranslation();
  return (
    <div>
      <a href="/"> {t("home")}</a>
      <h1
        css={css`
          font-size: 24px;
        `}
      >
        {t("404")}
      </h1>
    </div>
  );
};
