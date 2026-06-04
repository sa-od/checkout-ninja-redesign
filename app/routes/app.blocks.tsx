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
  Modal,
  Icon,
  ButtonGroup,
  InlineGrid,
  Badge,
  DropZone,
  ChoiceList,
  Link,
} from "@shopify/polaris";
import type { BadgeProps } from "@shopify/polaris";
import {
  MenuHorizontalIcon,
  ImportIcon,
  ExportIcon,
  ThemeTemplateIcon,
  SearchIcon,
  ChartHistogramGrowthIcon,
  EditIcon,
  LayoutColumns3Icon,
  ShieldCheckMarkIcon,
} from "@shopify/polaris-icons";

// ── Template browser data ─────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "upsell", label: "Upsell & Cross-Sell" },
  { id: "personalisation", label: "Personalisation & Gift Options" },
  { id: "checkout-notices", label: "Checkout Notices & Information" },
  { id: "social-proof", label: "Social Proof & Reviews" },
  { id: "trust", label: "Trust & Assurance" },
];

const CATEGORY_TONE: Record<string, BadgeProps["tone"]> = {
  upsell: "success-strong",
  personalisation: "magic",
  "checkout-notices": "warning",
  "social-proof": "info",
  trust: "attention",
};

const TEMPLATES_DATA = [
  {
    id: 1,
    name: "Available Coupons",
    category: "upsell",
    blocks: 1,
    image: "/Templates/template1.png",
  },
  {
    id: 2,
    name: "Free Shipping Progress Bar",
    category: "upsell",
    blocks: 1,
    image: "/Templates/template2.png",
  },
  {
    id: 3,
    name: "Checkout Upsell",
    category: "upsell",
    blocks: 1,
    image: "/Templates/template3.png",
  },
  {
    id: 4,
    name: "Gift Option Toggle",
    category: "personalisation",
    blocks: 1,
    image: "/Templates/template4.png",
  },
  {
    id: 5,
    name: "Add a Note to This Gift",
    category: "personalisation",
    blocks: 1,
    image: "/Templates/template5.png",
  },
  {
    id: 6,
    name: "Customs Duties & Tax Guarantee Notice",
    category: "checkout-notices",
    blocks: 1,
    image: "/Templates/template6.png",
  },
  {
    id: 7,
    name: "Google Review Testimonial",
    category: "social-proof",
    blocks: 1,
    image: "/Templates/template7.png",
  },
  {
    id: 8,
    name: "Accepted Payment Methods",
    category: "trust",
    blocks: 1,
    image: "/Templates/template8.png",
  },
  {
    id: 9,
    name: "Customer Reviews",
    category: "checkout-notices",
    blocks: 1,
    image: "/Templates/template9.png",
  },
  {
    id: 10,
    name: "Trust Badges",
    category: "social-proof",
    blocks: 1,
    image: "/Templates/template10.png",
  },
  {
    id: 11,
    name: "Star Ratings Display",
    category: "checkout-notices",
    blocks: 1,
    image: "/Templates/template11.png",
  },
  {
    id: 12,
    name: "Green Promise Block",
    category: "trust",
    blocks: 3,
    image: "/Templates/template12.png",
  },
];

// ── Choose Block Type modal data ──────────────────────────────────────────────

const BLOCK_CATEGORIES = [
  { id: "all", label: "All", count: 23, icon: null },
  {
    id: "conversion",
    label: "Conversion Boosters",
    icon: ChartHistogramGrowthIcon,
    count: 3,
  },
  { id: "custom-fields", label: "Custom Fields", icon: EditIcon, count: 8 },
  {
    id: "layout",
    label: "Layout & Content",
    icon: LayoutColumns3Icon,
    count: 6,
  },
  {
    id: "trust",
    label: "Trust & Security",
    icon: ShieldCheckMarkIcon,
    count: 6,
  },
];

const BLOCKS_DATA = [
  // Conversion Boosters
  {
    id: 1,
    name: "Free Shipping Bar",
    category: "conversion",
    image: "/Blocks/block1.png",
  },
  {
    id: 2,
    name: "Countdown Timer",
    category: "conversion",
    image: "/Blocks/block2.png",
  },
  {
    id: 3,
    name: "Discount Banner",
    category: "conversion",
    image: "/Blocks/block3.png",
  },
  // Custom Fields
  {
    id: 4,
    name: "Text Field",
    category: "custom-fields",
    image: "/Blocks/block4.png",
  },
  {
    id: 5,
    name: "Dropdown Select",
    category: "custom-fields",
    image: "/Blocks/block5.png",
  },
  {
    id: 6,
    name: "Date Picker",
    category: "custom-fields",
    image: "/Blocks/block6.png",
  },
  {
    id: 7,
    name: "Number Input",
    category: "custom-fields",
    image: "/Blocks/block7.png",
  },
  {
    id: 8,
    name: "Multi-line Text",
    category: "custom-fields",
    image: "/Blocks/block8.png",
  },
  {
    id: 9,
    name: "Checkbox Group",
    category: "custom-fields",
    image: "/Blocks/block9.png",
  },
  {
    id: 10,
    name: "Radio Buttons",
    category: "custom-fields",
    image: "/Blocks/block10.png",
  },
  {
    id: 11,
    name: "File Upload",
    category: "custom-fields",
    image: "/Blocks/block11.png",
  },
  // Layout & Content
  {
    id: 12,
    name: "Image Banner",
    category: "layout",
    image: "/Blocks/block12.png",
  },
  {
    id: 13,
    name: "Two Column Layout",
    category: "layout",
    image: "/Blocks/block13.png",
  },
  {
    id: 14,
    name: "Accordion",
    category: "layout",
    image: "/Blocks/block14.png",
  },
  { id: 15, name: "Spacer", category: "layout", image: "/Blocks/block15.png" },
  { id: 16, name: "Divider", category: "layout", image: "/Blocks/block16.png" },
  {
    id: 17,
    name: "Card Block",
    category: "layout",
    image: "/Blocks/block17.png",
  },
  // Trust & Security
  {
    id: 18,
    name: "Trust Badge",
    category: "trust",
    image: "/Blocks/block18.png",
  },
  {
    id: 19,
    name: "Payment Icon",
    category: "trust",
    image: "/Blocks/block19.png",
  },
  {
    id: 20,
    name: "SSL Badge",
    category: "trust",
    image: "/Blocks/block20.png",
  },
  {
    id: 21,
    name: "Money Back Guarantee",
    category: "trust",
    image: "/Blocks/block21.png",
  },
  {
    id: 22,
    name: "Review Stars",
    category: "trust",
    image: "/Blocks/block22.png",
  },
  {
    id: 23,
    name: "Customer Count",
    category: "trust",
    image: "/Blocks/block23.png",
  },
];

// ── Browse Templates modal ────────────────────────────────────────────────────

function BrowseTemplatesModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = TEMPLATES_DATA.filter((t) => {
    const matchSearch = t.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchCat = activeCategory === "all" || t.category === activeCategory;
    return matchSearch && matchCat;
  });

  const catLabel = (id: string) =>
    CATEGORIES.find((c) => c.id === id)?.label ?? id;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Start with Templates"
      size="large"
    >
      <Modal.Section flush>
        <div style={{ display: "flex", height: "580px" }}>
          {/* ── Left sidebar: categories ── */}
          <div
            style={{
              width: "220px",
              flexShrink: 0,
              borderRight: "1px solid #e1e3e5",
              overflowY: "auto",
              paddingTop: "8px",
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 20px",
                  textAlign: "left",
                  background:
                    activeCategory === cat.id ? "#f6f6f7" : "transparent",
                  border: "none",
                  borderLeft:
                    activeCategory === cat.id
                      ? "3px solid #1a1a1a"
                      : "3px solid transparent",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#1a1a1a",
                  fontWeight: activeCategory === cat.id ? 600 : 400,
                  lineHeight: "20px",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* ── Right panel ── */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Search */}
            <div style={{ padding: "16px 16px 12px" }}>
              <TextField
                label="Search templates"
                labelHidden
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search templates..."
                prefix={<Icon source={SearchIcon} />}
                autoComplete="off"
              />
            </div>

            {/* Scrollable template grid */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
              {filtered.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center" }}>
                  <Text variant="bodyMd" tone="subdued" as="p">
                    No templates found
                  </Text>
                </div>
              ) : (
                <InlineGrid columns={2} gap="400">
                  {filtered.map((t) => {
                    const tone =
                      CATEGORY_TONE[t.category] ?? "attention-strong";
                    return (
                      <div
                        key={t.id}
                        style={{
                          border: "1px solid #e1e3e5",
                          borderRadius: "8px",
                          overflow: "hidden",
                          background: "#fff",
                        }}
                      >
                        {/* Preview image */}
                        <div style={{ position: "relative" }}>
                          <img
                            src={t.image}
                            alt={t.name}
                            style={{
                              width: "100%",
                              display: "block",
                              objectFit: "cover",
                            }}
                          />
                          {activeCategory === "all" && (
                            <div
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                              }}
                            >
                              <Badge tone={tone}>{catLabel(t.category)}</Badge>
                            </div>
                          )}
                        </div>

                        {/* Card footer */}
                        <div
                          style={{
                            padding: "12px 16px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <BlockStack gap="050">
                            <Text variant="bodyMd" fontWeight="semibold" as="p">
                              {t.name}
                            </Text>
                            <Text variant="bodySm" tone="subdued" as="p">
                              {t.blocks} Block{t.blocks > 1 ? "s" : ""}
                            </Text>
                          </BlockStack>
                          <Button
                            variant="primary"
                            size="slim"
                            onClick={onClose}
                          >
                            Use Template
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </InlineGrid>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid #e1e3e5",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={onClose}>Start with blank template</Button>
            </div>
          </div>
        </div>
      </Modal.Section>
    </Modal>
  );
}

// ── Choose Block Type modal ───────────────────────────────────────────────────

function AddBlockModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = BLOCKS_DATA.filter((b) => {
    const matchSearch = b.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchCat = activeCategory === "all" || b.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Choose Block Type"
      secondaryActions={[{ content: "Cancel", onAction: onClose }]}
      size="large"
    >
      <Modal.Section flush>
        <div
          style={{ display: "flex", flexDirection: "column", height: "600px" }}
        >
          {/* Description */}
          <div style={{ padding: "16px 20px 8px" }}>
            <Text variant="bodyMd" tone="subdued" as="p">
              Select the type of block you want to add to your checkout. Each
              block type has specific settings you can configure.
            </Text>
          </div>

          {/* Category pills */}
          <Box
            paddingInlineStart="400"
            paddingInlineEnd="400"
            paddingBlockEnd="300"
          >
            <ButtonGroup gap="loose">
              {BLOCK_CATEGORIES.map((cat) => (
                <Button
                  key={cat.id}
                  pressed={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  icon={cat.icon ?? undefined}
                  size="slim"
                  variant="tertiary"
                >
                  {cat.label} ({cat.count.toString()})
                </Button>
              ))}
            </ButtonGroup>
          </Box>

          {/* Search */}
          <div style={{ padding: "0 20px 12px" }}>
            <TextField
              label="Search block types"
              labelHidden
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search block types..."
              prefix={<Icon source={SearchIcon} />}
              autoComplete="off"
            />
          </div>

          {/* Scrollable grid */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <Text variant="bodyMd" tone="subdued" as="p">
                  No block types found
                </Text>
              </div>
            ) : (
              <InlineGrid columns={2} gap="400">
                {filtered.map((block) => (
                  <div
                    key={block.id}
                    style={{
                      border: "1px solid #e1e3e5",
                      borderRadius: "8px",
                      overflow: "hidden",
                      background: "#fff",
                    }}
                  >
                    {/* Preview image */}
                    <div
                      style={{
                        background: "#f6f6f7",
                        padding: "16px",
                        borderBottom: "1px solid #e1e3e5",
                      }}
                    >
                      <img
                        src={block.image}
                        alt={block.name}
                        style={{
                          width: "100%",
                          display: "block",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    {/* Footer */}
                    <div
                      style={{
                        padding: "10px 14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Text variant="bodyMd" fontWeight="semibold" as="p">
                        {block.name}
                      </Text>
                      <Button variant="primary" size="slim" onClick={onClose}>
                        Add to checkout
                      </Button>
                    </div>
                  </div>
                ))}
              </InlineGrid>
            )}
          </div>
        </div>
      </Modal.Section>
    </Modal>
  );
}

// ── Import JSON modal ─────────────────────────────────────────────────────────

function ImportModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [importBehavior, setImportBehavior] = useState(["override"]);

  const handleDropZoneDrop = useCallback(
    (_dropFiles: File[], acceptedFiles: File[]) => {
      setFiles((f) => [...f, ...acceptedFiles]);
    },
    [],
  );

  const fileUploadMarkup = !files.length ? (
    <DropZone.FileUpload
      actionTitle="Add file"
      actionHint="Drag and drop your JSON file here, or click Add file"
    />
  ) : (
    <BlockStack gap="200">
      {files.map((file) => (
        <Text key={file.name} variant="bodyMd" as="p">
          {file.name}
        </Text>
      ))}
    </BlockStack>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Import data by JSON"
      primaryAction={{ content: "Upload and preview", onAction: onClose }}
      secondaryActions={[{ content: "Cancel", onAction: onClose }]}
    >
      <Modal.Section>
        <BlockStack gap="400">
          <DropZone
            accept=".json"
            type="file"
            onDrop={handleDropZoneDrop}
            label="Upload JSON file"
            labelHidden
          >
            {fileUploadMarkup}
          </DropZone>

          <Box
            borderWidth="025"
            borderColor="border"
            borderRadius="200"
            padding="400"
          >
            <BlockStack gap="300">
              <BlockStack gap="100">
                <Text variant="bodyMd" fontWeight="semibold" as="p">
                  Import behavior
                </Text>
                <Text variant="bodyMd" tone="subdued" as="p">
                  Choose how to handle existing data when importing
                </Text>
              </BlockStack>
              <ChoiceList
                title="Import behavior"
                titleHidden
                choices={[
                  {
                    label: "Override existing data",
                    value: "override",
                    helpText:
                      "Replace all current form data with imported data",
                  },
                  {
                    label: "Append to existing data",
                    value: "append",
                    helpText:
                      "Add imported data to existing data (for arrays like blocks, rules)",
                  },
                ]}
                selected={importBehavior}
                onChange={setImportBehavior}
              />
            </BlockStack>
          </Box>

          <Link url="#" removeUnderline>
            Download sample JSON
          </Link>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}

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
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [addBlockModalOpen, setAddBlockModalOpen] = useState(false);

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
        {
          content: "Browse Templates",
          icon: ThemeTemplateIcon,
          onAction: () => setTemplateModalOpen(true),
        },
      ]}
      actionGroups={[
        {
          title: "More actions",
          actions: [
            {
              content: "Import",
              icon: ImportIcon,
              onAction: () => setImportModalOpen(true),
            },
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
            <Button
              variant="primary"
              icon={ThemeTemplateIcon}
              onClick={() => setTemplateModalOpen(true)}
            >
              Browse Templates
            </Button>
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
                      <Button
                        variant="primary"
                        onClick={() => setAddBlockModalOpen(true)}
                      >
                        + Add block
                      </Button>
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
                    <Button onClick={() => setAddBlockModalOpen(true)}>
                      + Add block
                    </Button>
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

      <BrowseTemplatesModal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
      />

      <ImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
      />

      <AddBlockModal
        open={addBlockModalOpen}
        onClose={() => setAddBlockModalOpen(false)}
      />
    </Page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
