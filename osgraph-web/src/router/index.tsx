import { createBrowserRouter } from "react-router-dom";
import Home from "../home";
import Result from "../result";
import Share from "../share";
import NotFound from "../404";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/result",
    element: <Result />,
  },
  {
    path: "/share",
    element: <Share />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
