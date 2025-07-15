import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("./components/globalTheme/globalShell.tsx", [
    index("./pages/Home.tsx"),
    route("search", "./pages/Search.tsx"),
    route("help-center", "./pages/HelpCenter.tsx"), 
    route("account", "./pages/Account.tsx"), 
    layout("./components/dashboard/Dashboard.tsx", [
      // route("account", "./pages/Account.tsx"),
    ]),
  ]),
  
  layout("./features/auth/theme/AuthLayout.tsx", [
    route("login", "./pages/Login.tsx"),
    route("signup", "./pages/Signup.tsx"),
  ]),
] satisfies RouteConfig;