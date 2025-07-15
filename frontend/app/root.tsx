import 'bootstrap/dist/css/bootstrap.min.css';
import "./app.css";
import bootstrapHref from 'bootstrap/dist/css/bootstrap.min.css?url';
import appCssHref from './app.css?url';
import { isRouteErrorResponse, Outlet } from "react-router";

import type { Route } from "./+types/root";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from "redux-persist/lib/integration/react";
import { Links, Scripts, ScrollRestoration } from "react-router-dom";

export function links() {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    },
    { rel: "stylesheet", href: bootstrapHref },
    { rel: "stylesheet", href: appCssHref },
  ];
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Links />
      </head>
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Outlet />
            <ToastContainer position="top-right" autoClose={3000} />
          </PersistGate>
        </Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
