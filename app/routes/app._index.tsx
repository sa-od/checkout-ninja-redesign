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
  InlineGrid,
  Divider,
} from "@shopify/polaris";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

const TEMPLATES = [
  { id: "1", name: "Available Coupons", image: "/Templates/template1.png" },
  {
    id: "2",
    name: "Free Shipping Progress Bar",
    image: "/Templates/template2.png",
  },
  { id: "3", name: "Checkout Upsell", image: "/Templates/template3.png" },
  { id: "4", name: "Gift Option Toggle", image: "/Templates/template4.png" },
  {
    id: "5",
    name: "Add a Note to This Gift",
    image: "/Templates/template5.png",
  },
  {
    id: "6",
    name: "Customs Duties & Tax Notice",
    image: "/Templates/template6.png",
  },
];

const BLOCKS_TAB = [
  { id: "1", name: "Free Shipping Bar", image: "/Blocks/block1.png" },
  { id: "2", name: "Countdown Timer", image: "/Blocks/block2.png" },
  { id: "3", name: "Discount Banner", image: "/Blocks/block3.png" },
  { id: "4", name: "Text Field", image: "/Blocks/block4.png" },
  { id: "5", name: "Dropdown Select", image: "/Blocks/block5.png" },
  { id: "6", name: "Date Picker", image: "/Blocks/block6.png" },
];

const EXAMPLES = [
  { id: "1", name: "Feetly", image: "/Example/example1.png" },
  { id: "2", name: "Nuvita", image: "/Example/example2.png" },
];

const USE_CASES = [
  { id: "1", brand: "Feetly", image: "/Example/example1.png" },
  { id: "2", brand: "Nuvita", image: "/Example/example2.png" },
];

const TABS = [
  { id: "templates", content: "Templates" },
  { id: "blocks", content: "Blocks" },
  { id: "examples", content: "Examples" },
];

export default function Index() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = useCallback((tab: number) => setSelectedTab(tab), []);

  return (
    <Page
      title="Checkout Blocks"
      primaryAction={{ content: "+ Create block", onAction: () => {} }}
    >
      <BlockStack gap="600">
        {/* ── Empty state ── */}
        <Card padding="0">
          <EmptyState
            heading="No checkout blocks yet"
            action={{ content: "+ Create block", onAction: () => {} }}
            secondaryAction={{
              content: "Browse templates",
              onAction: () => {},
            }}
            image="/empty-state.png"
          >
            <p>
              Add blocks to your checkout to show upsells, trust badges, gift
              messages, and more — without touching code.
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
                  {selectedTab === 0 && (
                    <>
                      <InlineGrid columns={3} gap="400">
                        {TEMPLATES.map((item) => (
                          <BlockStack key={item.id} gap="0">
                            <div
                              style={{
                                border: "1px solid #e1e3e5",
                                borderRadius: "8px",
                                overflow: "hidden",
                              }}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{
                                  height: "60%",
                                  width: "100%",
                                  display: "block",
                                  objectFit: "cover",
                                }}
                              />
                              <Box
                                padding="300"
                                borderColor="border"
                                borderBlockStartWidth="025"
                              >
                                <BlockStack gap="200">
                                  <Text
                                    variant="bodyMd"
                                    fontWeight="medium"
                                    as="p"
                                  >
                                    {item.name}
                                  </Text>
                                  <Button variant="primary" size="slim">
                                    Use Template
                                  </Button>
                                </BlockStack>
                              </Box>
                            </div>
                          </BlockStack>
                        ))}
                      </InlineGrid>
                      <InlineStack align="end">
                        <Button variant="secondary" size="slim">
                          View all Templates
                        </Button>
                      </InlineStack>
                    </>
                  )}

                  {selectedTab === 1 && (
                    <>
                      <InlineGrid columns={3} gap="400">
                        {BLOCKS_TAB.map((item) => (
                          <BlockStack key={item.id} gap="0">
                            <div
                              style={{
                                border: "1px solid #e1e3e5",
                                borderRadius: "8px",
                                overflow: "hidden",
                              }}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{
                                  width: "100%",
                                  display: "block",
                                  objectFit: "cover",
                                }}
                              />
                              <Box
                                padding="300"
                                borderColor="border"
                                borderBlockStartWidth="025"
                              >
                                <BlockStack gap="200">
                                  <Text
                                    variant="bodyMd"
                                    fontWeight="medium"
                                    as="p"
                                  >
                                    {item.name}
                                  </Text>
                                  <Button variant="primary" size="slim">
                                    Add Block
                                  </Button>
                                </BlockStack>
                              </Box>
                            </div>
                          </BlockStack>
                        ))}
                      </InlineGrid>
                      <InlineStack align="end">
                        <Button variant="secondary" size="slim">
                          View all Blocks
                        </Button>
                      </InlineStack>
                    </>
                  )}

                  {selectedTab === 2 && (
                    <InlineGrid columns={2} gap="400">
                      {EXAMPLES.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            border: "1px solid #e1e3e5",
                            borderRadius: "8px",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: "100%",
                              display: "block",
                              objectFit: "cover",
                            }}
                          />
                          <Box
                            padding="300"
                            borderColor="border"
                            borderBlockStartWidth="025"
                          >
                            <Text variant="bodyMd" fontWeight="semibold" as="p">
                              {item.name}
                            </Text>
                          </Box>
                        </div>
                      ))}
                    </InlineGrid>
                  )}
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

          <InlineGrid columns={2} gap="400">
            {USE_CASES.map((uc) => (
              <div
                key={uc.id}
                style={{
                  border: "1px solid #e1e3e5",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <Box
                  padding="300"
                  borderColor="border"
                  borderBlockEndWidth="025"
                >
                  <Text variant="bodySm" fontWeight="semibold" as="p">
                    {uc.brand}
                  </Text>
                </Box>
                <img
                  src={uc.image}
                  alt={uc.brand}
                  style={{
                    width: "100%",
                    display: "block",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </InlineGrid>
        </BlockStack>

        <Divider />
      </BlockStack>
    </Page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
