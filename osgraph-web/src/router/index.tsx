import { createBrowserRouter } from "react-router-dom";
import NotFound from "../404";
import Home from "../home";
import Result from "../result";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/result",
    element: <Result />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default router;
