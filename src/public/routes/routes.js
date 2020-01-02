import Home from "../components/App";
import Sell from "../components/Sell";

const routes = [
  {
    path: "/",
    exact: true,
    component: Home
  },
  {
    path: "/sell",
    component: Sell
  }
];

export default routes;
