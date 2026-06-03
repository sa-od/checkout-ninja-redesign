import { useState, useCallback } from "react";
import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import {
  Page,
  Layout,
  BlockStack,
  InlineStack,
  Card,
  Button,
  Text,
  TextField,
  Select,
  Box,
  Divider,
  Popover,
  ActionList,
} from "@shopify/polaris";
import {
  MenuHorizontalIcon,
  ImportIcon,
  ExportIcon,
  ViewIcon,
} from "@shopify/polaris-icons";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: "36px",
        height: "20px",
        background: checked ? "#1a1a1a" : "#8c9196",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        position: "relative",
        flexShrink: 0,
        transition: "background 0.2s",
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "2px",
          left: checked ? "16px" : "2px",
          width: "16px",
          height: "16px",
          background: "#fff",
          borderRadius: "50%",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
          display: "block",
        }}
      />
    </button>
  );
}

export default function Blocks() {
  const [blockName, setBlockName] = useState("");
  const [conditionalVisibility, setConditionalVisibility] = useState(false);
  const [status, setStatus] = useState("active");
  const [layoutType, setLayoutType] = useState("horizontal");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleStatusChange = useCallback(
    (value: string) => setStatus(value),
    [],
  );
  const handleLayoutChange = useCallback(
    (value: string) => setLayoutType(value),
    [],
  );

  return (
    <Page
      title="New Checkout Block"
      backAction={{ content: "Blocks", url: "/app" }}
      secondaryActions={[
        { content: "Browse Templates", icon: ViewIcon, onAction: () => {} },
      ]}
      actionGroups={[
        {
          title: "More actions",
          actions: [
            { content: "Import", icon: ImportIcon, onAction: () => {} },
          ],
        },
      ]}
    >
      <BlockStack gap="500">
        {/* ── Start with a Template (full-width) ── */}
        <Card>
          <InlineStack align="space-between" blockAlign="center" gap="400">
            <BlockStack gap="100">
              <Text variant="headingMd" as="h3">
                Start with a Template
              </Text>
              <Text variant="bodyMd" tone="subdued" as="p">
                Browse our pre-configured templates to get started quickly, or
                start from scratch.
              </Text>
            </BlockStack>
            <Button variant="primary" icon={ViewIcon}>Browse Templates</Button>
          </InlineStack>
        </Card>

        {/* ── Two-column layout ── */}
        <Layout>
          {/* Left column */}
          <Layout.Section>
            <BlockStack gap="400">
              {/* Block Name */}
              <Card>
                <TextField
                  label="Block Name"
                  value={blockName}
                  onChange={setBlockName}
                  helpText="This will not displayed in checkout page, for reference purpose only."
                  autoComplete="off"
                />
              </Card>

              {/* Conditional block visibility */}
              <Card>
                <BlockStack gap="200">
                  <InlineStack gap="400" blockAlign="start" wrap={false}>
                    <Toggle
                      checked={conditionalVisibility}
                      onChange={setConditionalVisibility}
                    />
                    <BlockStack gap="100">
                      <Text variant="bodyMd" fontWeight="semibold" as="p">
                        Enable conditional block visibility
                      </Text>
                    </BlockStack>
                  </InlineStack>
                  <Text variant="bodyMd" tone="subdued" as="p">
                    When enabled, blocks will only appear when your specified
                    conditions are met. When disabled, blocks are always
                    visible.
                  </Text>
                </BlockStack>
              </Card>

              {/* Checkout Blocks */}
              <Card>
                <BlockStack gap="400">
                  {/* Header row */}
                  <InlineStack align="space-between" blockAlign="center">
                    <BlockStack gap="050">
                      <Text variant="headingMd" as="h3">
                        Checkout Blocks
                      </Text>
                      <Text variant="bodyMd" tone="subdued" as="p">
                        Manage your checkout blocks
                      </Text>
                    </BlockStack>
                    <InlineStack gap="200">
                      <Button variant="primary">+ Add block</Button>
                      <Popover
                        active={menuOpen}
                        activator={
                          <Button
                            icon={MenuHorizontalIcon}
                            variant="tertiary"
                            onClick={() => setMenuOpen((o) => !o)}
                            accessibilityLabel="More actions"
                          />
                        }
                        onClose={() => setMenuOpen(false)}
                      >
                        <ActionList
                          actionRole="menuitem"
                          items={[
                            {
                              content: "Import blocks",
                              icon: ImportIcon,
                              onAction: () => setMenuOpen(false),
                            },
                            {
                              content: "Export blocks",
                              icon: ExportIcon,
                              onAction: () => setMenuOpen(false),
                            },
                          ]}
                        />
                      </Popover>
                    </InlineStack>
                  </InlineStack>

                  {/* Empty state area */}
                  <div
                    style={{
                      border: "1px solid #e1e3e5",
                      borderRadius: "8px",
                      background: "#f6f6f7",
                      minHeight: "80px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "24px",
                    }}
                  >
                    <Text variant="bodyMd" tone="subdued" as="p">
                      No blocks added yet
                    </Text>
                  </div>

                  <Divider />

                  <InlineStack align="center">
                    <Button>+ Add block</Button>
                  </InlineStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>

          {/* Right sidebar */}
          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
              {/* Status */}
              <Card>
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h3">
                    Status
                  </Text>
                  <Select
                    label="Status"
                    labelHidden
                    options={[
                      { label: "Active", value: "active" },
                      { label: "Draft", value: "draft" },
                    ]}
                    value={status}
                    onChange={handleStatusChange}
                  />
                </BlockStack>
              </Card>

              {/* Block Details */}
              <Card>
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h3">
                    Block Details
                  </Text>
                  <Text variant="bodyMd" tone="subdued" as="p">
                    Copy this ID and paste it in the content block to use it in
                    the checkout page
                  </Text>
                  <Button>Open Checkout Editor</Button>
                </BlockStack>
              </Card>

              {/* Block Styles */}
              <Card>
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h3">
                    Block Styles
                  </Text>
                  <Select
                    label="Layout Type"
                    options={[
                      { label: "Horizontal", value: "horizontal" },
                      { label: "Vertical", value: "vertical" },
                    ]}
                    value={layoutType}
                    onChange={handleLayoutChange}
                  />
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
