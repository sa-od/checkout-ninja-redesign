import { useEffect } from "react";
import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData, useRouteError, useNavigate } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { NavMenu } from "@shopify/app-bridge-react";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  // eslint-disable-next-line no-undef
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  // NavMenu fires "shopify:navigate" events, but event.target loses the href
  // through shadow DOM re-targeting. composedPath() pierces the shadow root
  // to find the actual <a> element so React Router gets the correct path.
  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const path = event.composedPath();
      const anchor = path.find(
        (el) => (el as Element).tagName?.toLowerCase() === "a",
      ) as HTMLAnchorElement | undefined;
      const href =
        anchor?.getAttribute("href") ??
        (event.target as Element)?.getAttribute("href");
      if (href) navigate(href);
    };
    document.addEventListener("shopify:navigate", handleNavigate);
    return () => document.removeEventListener("shopify:navigate", handleNavigate);
  }, [navigate]);

  return (
    <AppProvider embedded apiKey={apiKey}>
      <PolarisProvider i18n={enTranslations}>
        <NavMenu>
          <a href="/app" rel="home">Home</a>
          <a href="/app/blocks">Blocks</a>
        </NavMenu>
        <Outlet />
      </PolarisProvider>
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
