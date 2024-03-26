/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import { makeVarCss } from "../utils";
import { GLOBAL_STYLES } from "../style";

interface IProps {
  children: React.ReactNode;
}

export const OSGraph = (props: IProps) => {
  const style = React.useMemo(() => makeVarCss(GLOBAL_STYLES), []);

  return (
    <div
      className={`os-graph-container`}
      style={style}
      css={css`
        minheight: 100vh;
      `}
    >
      {props.children}
    </div>
  );
};
