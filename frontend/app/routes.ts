import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("./components/globalTheme/globalShell.tsx", [
    index("./pages/Home.tsx"),
    route("search", "./pages/Search.tsx"),
    route("help-center", "./pages/HelpCenter.tsx"), 
    route("event-details/:eventTitle", "./pages/EventDetails.tsx"),
    route("seat-selection/:eventTitle?", "./pages/SeatSelectionPage.tsx"),
    route("calendar", "./features/calendar/components/CalendarPage.tsx"),
    route("account", "./pages/Account.tsx")
  ]),

  layout("./features/auth/theme/AuthLayout.tsx", [
    route("login", "./pages/Login.tsx"),
    route("signup", "./pages/Signup.tsx"),
  ]),
  
  
] satisfies RouteConfig;
