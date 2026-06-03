import { useState, useCallback } from "react";
import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import {
  Page,
  BlockStack,
  InlineStack,
  Box,
  Card,
  Button,
  Text,
  Tabs,
  EmptyState,
  Link,
  Divider,
} from "@shopify/polaris";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

const TEMPLATES = [
  { id: "coupons", name: "Available Coupons" },
  { id: "shipping-bar", name: "Free Shipping Progress Bar" },
  { id: "upsell", name: "Checkout Upsell" },
  { id: "gift-toggle", name: "Gift Option Toggle" },
  { id: "gift-note", name: "Add a Note to This Gift" },
  { id: "customs", name: "Customs Duties & Tax Guarantee Notice" },
];

const USE_CASES = [
  { id: "1", brand: "Feetly" },
  { id: "2", brand: "Nuvita" },
  { id: "3", brand: "Bloomcraft" },
  { id: "4", brand: "ZeroWaste Co." },
];

const TABS = [
  { id: "templates", content: "Templates" },
  { id: "blocks", content: "Blocks" },
  { id: "examples", content: "Examples" },
];

export default function Index() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [carouselStart, setCarouselStart] = useState(0);

  const handleTabChange = useCallback((tab: number) => setSelectedTab(tab), []);

  const visibleUseCases = USE_CASES.slice(carouselStart, carouselStart + 2);
  const canGoBack = carouselStart > 0;
  const canGoForward = carouselStart + 2 < USE_CASES.length;

  return (
    <Page title="Welcome">
      <BlockStack gap="600">
        {/* ── Hero empty-state card ── */}
        <Card>
          <EmptyState
            heading="First up: Create new Block!"
            action={{ content: "Create block", onAction: () => {} }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>
              Create your first checkout block to start customizing your Shopify
              checkout experience.
            </p>
          </EmptyState>
        </Card>

        {/* ── Stay Updated ── */}
        <BlockStack gap="300">
          <Text variant="headingMd" as="h2">
            Stay Updated
          </Text>
          <Card padding="0">
            <Tabs tabs={TABS} selected={selectedTab} onSelect={handleTabChange}>
              <Box padding="400">
                <BlockStack gap="400">
                  {/* 3-column template grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "16px",
                    }}
                  >
                    {TEMPLATES.map((template) => (
                      <div
                        key={template.id}
                        style={{
                          border: "1px solid #e1e3e5",
                          borderRadius: "8px",
                          overflow: "hidden",
                          background: "#fff",
                        }}
                      >
                        {/* Preview area */}
                        <div
                          style={{
                            height: "110px",
                            background: "#f6f6f7",
                            borderBottom: "1px solid #e1e3e5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="60"
                            height="44"
                            viewBox="0 0 60 44"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              width="60"
                              height="44"
                              rx="4"
                              fill="#e4e5e7"
                            />
                            <rect
                              x="6"
                              y="6"
                              width="48"
                              height="6"
                              rx="2"
                              fill="#c9cccf"
                            />
                            <rect
                              x="6"
                              y="16"
                              width="36"
                              height="4"
                              rx="2"
                              fill="#c9cccf"
                            />
                            <rect
                              x="6"
                              y="24"
                              width="28"
                              height="4"
                              rx="2"
                              fill="#c9cccf"
                            />
                            <rect
                              x="6"
                              y="34"
                              width="18"
                              height="5"
                              rx="2.5"
                              fill="#c9cccf"
                            />
                          </svg>
                        </div>

                        {/* Card body */}
                        <div style={{ padding: "12px" }}>
                          <BlockStack gap="200">
                            <Text variant="bodyMd" fontWeight="medium" as="p">
                              {template.name}
                            </Text>
                            <Button variant="primary" size="slim">
                              Use Template
                            </Button>
                          </BlockStack>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View all link */}
                  <InlineStack align="end">
                    <Button variant="secondary" size="slim">
                      View all Templates
                    </Button>
                  </InlineStack>
                </BlockStack>
              </Box>
            </Tabs>
          </Card>
        </BlockStack>

        {/* ── Discover use cases ── */}
        <BlockStack gap="300">
          <Text variant="headingMd" as="h2">
            Discover What&apos;s Possible! Here are some real use cases.
          </Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr 40px",
              gap: "16px",
              alignItems: "center",
            }}
          >
            {/* Prev button */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="tertiary"
                disabled={!canGoBack}
                onClick={() => setCarouselStart((s) => s - 1)}
              >
                ‹
              </Button>
            </div>

            {/* Two visible cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {visibleUseCases.map((uc) => (
                <div
                  key={uc.id}
                  style={{
                    border: "1px solid #e1e3e5",
                    borderRadius: "8px",
                    overflow: "hidden",
                    background: "#fff",
                  }}
                >
                  {/* Brand label */}
                  <div
                    style={{
                      padding: "10px 14px",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <Text variant="bodySm" fontWeight="semibold" as="p">
                      {uc.brand}
                    </Text>
                  </div>

                  {/* Screenshot placeholder */}
                  <div
                    style={{
                      height: "180px",
                      background: "#f6f6f7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="120"
                      height="90"
                      viewBox="0 0 120 90"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="120" height="90" rx="4" fill="#e4e5e7" />
                      <rect
                        x="8"
                        y="8"
                        width="104"
                        height="12"
                        rx="2"
                        fill="#c9cccf"
                      />
                      <rect
                        x="8"
                        y="26"
                        width="50"
                        height="50"
                        rx="2"
                        fill="#c9cccf"
                      />
                      <rect
                        x="66"
                        y="26"
                        width="46"
                        height="8"
                        rx="2"
                        fill="#c9cccf"
                      />
                      <rect
                        x="66"
                        y="38"
                        width="36"
                        height="6"
                        rx="2"
                        fill="#c9cccf"
                      />
                      <rect
                        x="66"
                        y="48"
                        width="40"
                        height="6"
                        rx="2"
                        fill="#c9cccf"
                      />
                      <rect
                        x="66"
                        y="62"
                        width="30"
                        height="8"
                        rx="4"
                        fill="#c9cccf"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Next button */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="tertiary"
                disabled={!canGoForward}
                onClick={() => setCarouselStart((s) => s + 1)}
              >
                ›
              </Button>
            </div>
          </div>
        </BlockStack>

        <Divider />
      </BlockStack>
    </Page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
