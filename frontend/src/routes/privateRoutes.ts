import { lazy } from "react";
import { routes } from "./routes";

const IndexPage = lazy(() => import("../pages/Main"));
const ProfilePage = lazy(() => import("../pages/Profile"));

export const privateRoutes = [
  {
    title: "main",
    path: routes.main,
    component: IndexPage,
  },
  {
    title: "profile",
    path: routes.profile,
    component: ProfilePage,
  }
];