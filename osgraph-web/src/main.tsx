import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./i18n";
import router from "./router";

// @ts-ignore
Tracert.call("set", {
  spmAPos: "a4378",
  bizType: "common",
  autoExpo: true,
  autoLogPv: true,
  ifRouterNeedPv: true
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
