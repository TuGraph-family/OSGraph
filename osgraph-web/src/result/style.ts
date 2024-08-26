import { css } from "@emotion/react";

export const GRAPH_STYLE = css`
  display: flex;
  flex-direction: column;

  .header {
    height: var(--search-height);
    background-color: #f2f2f2;
    display: flex;
    align-items: center;
    padding: 0 24px;
    justify-content: space-between;
    .sel {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    button {
      width: 65px;
      height: 32px;
      background: #ffffff;
      border: 1px solid #dddddf;
      border-radius: 6px;
      margin-left: 8px;
      cursor: pointer;

      &:hover {
        background: #f5f5f5;
      }
    }
  }

  .graph {
    height: calc(100vh - var(--search-height));
  }

  .graph-share {
    height: 100vh;
  }
`;
