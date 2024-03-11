import { createBrowserRouter } from "react-router-dom";
import Home from "../home";
import Graph from "../graph";
import NotFound from "../404";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/graph",
    element: <Graph />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
