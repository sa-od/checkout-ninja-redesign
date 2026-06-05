import { useState, useCallback, useEffect } from "react";
import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useSearchParams, useNavigate } from "react-router";
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
  Frame,
  Toast,
  Tooltip,
} from "@shopify/polaris";
import type { BadgeProps } from "@shopify/polaris";
import {
  MenuHorizontalIcon,
  ImportIcon,
  ExportIcon,
  SearchIcon,
  ChartHistogramGrowthIcon,
  EditIcon,
  LayoutColumns3Icon,
  ShieldCheckMarkIcon,
  DragHandleIcon,
  SettingsIcon,
  ViewIcon,
  HideIcon,
  DeleteIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClipboardIcon,
  ExternalIcon,
  XSmallIcon,
  PlanFilledIcon,
} from "@shopify/polaris-icons";
import { useAppBridge } from "@shopify/app-bridge-react";

// ── Condition options ─────────────────────────────────────────────────────────

const CONDITION_OPTIONS = [
  { label: "Select an option", value: "" },
  { label: "Cart Total", value: "cart_total" },
  { label: "Variant not in cart", value: "variant_not_in_cart" },
  { label: "Variant in cart", value: "variant_in_cart" },
  { label: "Product in cart", value: "product_in_cart" },
  { label: "Product not in cart", value: "product_not_in_cart" },
  { label: "Product quantity in cart", value: "product_quantity_in_cart" },
  { label: "Product type in cart", value: "product_type_in_cart" },
  { label: "Product type not in cart", value: "product_type_not_in_cart" },
  {
    label: "No of Products (Include quantity for each product)",
    value: "no_of_products",
  },
  { label: "Vendor Name in cart", value: "vendor_name_in_cart" },
  { label: "Vendor Name not in cart", value: "vendor_name_not_in_cart" },
  { label: "Customer billing has phone", value: "customer_billing_has_phone" },
  { label: "Customer billing has email", value: "customer_billing_has_email" },
  { label: "Gift card is applied", value: "gift_card_is_applied" },
  { label: "No of gift cards applied", value: "no_of_gift_cards_applied" },
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Shipping Address 1", value: "shipping_address_1" },
  { label: "Shipping Address 2", value: "shipping_address_2" },
  { label: "Shipping Country", value: "shipping_country" },
  { label: "Shipping State / Province", value: "shipping_state_province" },
  {
    label: "Shipping Delivery method title Selected by Customer",
    value: "shipping_delivery_method_title",
  },
  {
    label: "When delivery type is shop pickup",
    value: "delivery_type_shop_pickup",
  },
  { label: "Payment Method Type", value: "payment_method_type" },
  { label: "Payment Method Handle", value: "payment_method_handle" },
  {
    label: "Discount Code (order and shipping discounts only)",
    value: "discount_code",
  },
  {
    label: "Discount Title (order and shipping discounts only)",
    value: "discount_title",
  },
  { label: "Product Discount Code", value: "product_discount_code" },
  { label: "Product Discount Title", value: "product_discount_title" },
  { label: "Cart attribute key and value", value: "cart_attribute_key_value" },
  { label: "Cart metafield key and value", value: "cart_metafield_key_value" },
];

const COMPARISON_OPTIONS = [
  { label: "-", value: "" },
  { label: "Greater than", value: "gt" },
  { label: "Less than", value: "lt" },
  { label: "Equal to", value: "eq" },
  { label: "Not equal to", value: "ne" },
  { label: "Greater than or equal", value: "gte" },
  { label: "Less than or equal", value: "lte" },
];

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
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (template: { id: number; name: string; category: string }) => void;
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
              borderRight: "1px solid var(--p-color-border)",
              overflowY: "auto",
              paddingTop: "8px",
            }}
          >
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                style={{
                  borderLeft:
                    activeCategory === cat.id
                      ? "3px solid var(--p-color-text)"
                      : "3px solid transparent",
                  background:
                    activeCategory === cat.id
                      ? "var(--p-color-bg-surface-secondary)"
                      : "transparent",
                }}
              >
                <Button
                  variant="tertiary"
                  pressed={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  fullWidth
                  textAlign="left"
                >
                  {cat.label}
                </Button>
              </div>
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
                          border: "1px solid var(--p-color-border)",
                          borderRadius: "8px",
                          overflow: "hidden",
                          background: "var(--p-color-bg-surface)",
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
                            onClick={() => {
                              onSelect({
                                id: t.id,
                                name: t.name,
                                category: t.category,
                              });
                              onClose();
                            }}
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
                borderTop: "1px solid var(--p-color-border)",
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

type AddedBlock = {
  instanceId: number;
  id: number;
  name: string;
  category: string;
  active: boolean;
};

function AddBlockModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (block: AddedBlock) => void;
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
                      border: "1px solid var(--p-color-border)",
                      borderRadius: "8px",
                      overflow: "hidden",
                      background: "var(--p-color-bg-surface)",
                    }}
                  >
                    {/* Preview image */}
                    <div
                      style={{
                        background: "var(--p-color-bg-surface-secondary)",
                        padding: "16px",
                        borderBottom: "1px solid var(--p-color-border)",
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
                      <Button
                        variant="primary"
                        size="slim"
                        onClick={() => {
                          onAdd({
                            instanceId: Date.now(),
                            id: block.id,
                            name: block.name,
                            category: block.category,
                            active: true,
                          });
                          onClose();
                        }}
                      >
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

// ── Block Edit modal ──────────────────────────────────────────────────────────

function BlockEditModal({
  block,
  onClose,
}: {
  block: AddedBlock | null;
  onClose: () => void;
}) {
  const [threshold, setThreshold] = useState("300");
  const [messageInProgress, setMessageInProgress] = useState(
    "Add {remaining} more to get free shipping!",
  );
  const [messageCompleted, setMessageCompleted] = useState(
    "You qualify for free shipping!",
  );
  const [barColor, setBarColor] = useState("critical");
  const [barSize, setBarSize] = useState("large");
  const [textSize, setTextSize] = useState("base");
  const [background, setBackground] = useState("base");
  const [border, setBorder] = useState("dotted");
  const [borderRadius, setBorderRadius] = useState("large");
  const [padding, setPadding] = useState("tight");
  const [spacing, setSpacing] = useState("tight");

  if (!block) return null;

  const typeSlug = block.name.toLowerCase().replace(/\s+/g, "_");

  return (
    <Modal
      open
      onClose={onClose}
      title={`Edit - ${block.name}`}
      size="large"
      primaryAction={{ content: "Done", onAction: onClose }}
    >
      <Modal.Section flush>
        <div style={{ display: "flex", height: "560px" }}>
          {/* ── Left: configuration ── */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
            <BlockStack gap="500">
              <InlineStack gap="200">
                <Badge>{typeSlug}</Badge>
                <Badge tone={block.active ? "success" : "critical"}>
                  {block.active ? "Active" : "Inactive"}
                </Badge>
              </InlineStack>

              <BlockStack gap="300">
                <Text variant="headingMd" as="h3">
                  Configuration
                </Text>
                <TextField
                  label="Free Shipping Threshold"
                  value={threshold}
                  onChange={setThreshold}
                  type="number"
                  helpText="The minimum order amount to qualify for free shipping (in store currency)"
                  autoComplete="off"
                />
                <TextField
                  label="Message (In Progress)"
                  value={messageInProgress}
                  onChange={setMessageInProgress}
                  helpText="Use {remaining} for the remaining amount, {current} for current total, {threshold} for the free shipping threshold"
                  autoComplete="off"
                />
                <TextField
                  label="Message (Completed)"
                  value={messageCompleted}
                  onChange={setMessageCompleted}
                  helpText="Message shown when the threshold is reached"
                  autoComplete="off"
                />
              </BlockStack>

              <BlockStack gap="300">
                <Text variant="headingMd" as="h3">
                  Appearance
                </Text>
                <InlineGrid columns={3} gap="300">
                  <Select
                    label="Progress Bar Color"
                    options={["Critical", "Info", "Success", "Warning"].map(
                      (v) => ({ label: v, value: v.toLowerCase() }),
                    )}
                    value={barColor}
                    onChange={setBarColor}
                  />
                  <Select
                    label="Progress Bar Size"
                    options={["Small", "Medium", "Large"].map((v) => ({
                      label: v,
                      value: v.toLowerCase(),
                    }))}
                    value={barSize}
                    onChange={setBarSize}
                  />
                  <Select
                    label="Text Size"
                    options={["Small", "Base", "Large"].map((v) => ({
                      label: v,
                      value: v.toLowerCase(),
                    }))}
                    value={textSize}
                    onChange={setTextSize}
                  />
                </InlineGrid>
              </BlockStack>

              <BlockStack gap="300">
                <Text variant="headingMd" as="h3">
                  Advanced Styling
                </Text>
                <InlineGrid columns={3} gap="300">
                  <Select
                    label="Background"
                    options={["Base", "Surface", "Secondary"].map((v) => ({
                      label: v,
                      value: v.toLowerCase(),
                    }))}
                    value={background}
                    onChange={setBackground}
                  />
                  <Select
                    label="Border"
                    options={["None", "Solid", "Dotted", "Dashed"].map((v) => ({
                      label: v,
                      value: v.toLowerCase(),
                    }))}
                    value={border}
                    onChange={setBorder}
                  />
                  <Select
                    label="Border Radius"
                    options={["None", "Small", "Medium", "Large"].map((v) => ({
                      label: v,
                      value: v.toLowerCase(),
                    }))}
                    value={borderRadius}
                    onChange={setBorderRadius}
                  />
                </InlineGrid>
                <InlineGrid columns={2} gap="300">
                  <Select
                    label="Padding"
                    options={["None", "Tight", "Base", "Loose"].map((v) => ({
                      label: v,
                      value: v.toLowerCase(),
                    }))}
                    value={padding}
                    onChange={setPadding}
                  />
                  <Select
                    label="Element Spacing"
                    options={["None", "Tight", "Base", "Loose"].map((v) => ({
                      label: v,
                      value: v.toLowerCase(),
                    }))}
                    value={spacing}
                    onChange={setSpacing}
                  />
                </InlineGrid>
              </BlockStack>
            </BlockStack>
          </div>

          {/* ── Right: preview ── */}
          <div
            style={{
              width: "340px",
              flexShrink: 0,
              borderLeft: "1px solid var(--p-color-border)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--p-color-border)",
              }}
            >
              <Text variant="headingMd" as="h3">
                Preview
              </Text>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                background: "var(--p-color-bg-surface-secondary)",
                gap: "8px",
              }}
            >
              <Text variant="bodyMd" tone="subdued" as="p" alignment="center">
                Preview not available for this block type.
              </Text>
              <Text variant="bodySm" tone="subdued" as="p" alignment="center">
                Block Type: {typeSlug}
              </Text>
            </div>
          </div>
        </div>
      </Modal.Section>
    </Modal>
  );
}

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
  const shopify = useAppBridge();
  const navigate = useNavigate();
  const [blockName, setBlockName] = useState("");
  const [conditionalVisibility, setConditionalVisibility] = useState(false);
  const [status, setStatus] = useState("active");
  const [layoutType, setLayoutType] = useState("horizontal");
  const [menuOpen, setMenuOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [addBlockModalOpen, setAddBlockModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<AddedBlock | null>(null);
  const [exportToastActive, setExportToastActive] = useState(false);
  const [saveToastActive, setSaveToastActive] = useState(false);
  const [savedBlockId, setSavedBlockId] = useState<string | null>(null);
  const [copyToastActive, setCopyToastActive] = useState(false);
  const [showFirstSaveTooltip, setShowFirstSaveTooltip] = useState(false);
  const [addedBlocks, setAddedBlocks] = useState<AddedBlock[]>([]);
  const [conditions, setConditions] = useState<
    { id: number; value: string; extras: Record<string, string> }[]
  >([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const isDirty =
    addedBlocks.length > 0 ||
    blockName !== "" ||
    conditionalVisibility ||
    conditions.length > 0;

  const addCondition = useCallback(
    () =>
      setConditions((prev) => [
        ...prev,
        { id: Date.now(), value: "", extras: {} },
      ]),
    [],
  );
  const removeCondition = useCallback(
    (id: number) => setConditions((prev) => prev.filter((c) => c.id !== id)),
    [],
  );
  const updateCondition = useCallback(
    (id: number, value: string) =>
      setConditions((prev) =>
        prev.map((c) => (c.id === id ? { ...c, value, extras: {} } : c)),
      ),
    [],
  );
  const updateConditionExtra = useCallback(
    (id: number, key: string, val: string) =>
      setConditions((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, extras: { ...c.extras, [key]: val } } : c,
        ),
      ),
    [],
  );
  const moveConditionUp = useCallback(
    (id: number) =>
      setConditions((prev) => {
        const idx = prev.findIndex((c) => c.id === id);
        if (idx <= 0) return prev;
        const next = [...prev];
        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
        return next;
      }),
    [],
  );
  const moveConditionDown = useCallback(
    (id: number) =>
      setConditions((prev) => {
        const idx = prev.findIndex((c) => c.id === id);
        if (idx >= prev.length - 1) return prev;
        const next = [...prev];
        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
        return next;
      }),
    [],
  );

  const renderConditionExtras = (cond: {
    id: number;
    value: string;
    extras: Record<string, string>;
  }) => {
    const upd = (key: string, val: string) =>
      updateConditionExtra(cond.id, key, val);
    const e = cond.extras;
    switch (cond.value) {
      case "cart_total":
        return (
          <InlineGrid columns={2} gap="300">
            <Select
              label="When cart total is"
              options={COMPARISON_OPTIONS}
              value={e.comparison ?? ""}
              onChange={(v) => upd("comparison", v)}
            />
            <TextField
              label="Amount"
              value={e.amount ?? ""}
              onChange={(v) => upd("amount", v)}
              helpText="Enter the amount in your store currency"
              type="number"
              autoComplete="off"
            />
          </InlineGrid>
        );
      case "variant_in_cart":
      case "variant_not_in_cart":
        return (
          <BlockStack gap="100">
            <Text variant="bodySm" fontWeight="medium" as="p">
              Product Variant
            </Text>
            <Button fullWidth onClick={() => {}}>
              Select Product Variant
            </Button>
          </BlockStack>
        );
      case "product_in_cart":
      case "product_not_in_cart":
        return (
          <BlockStack gap="100">
            <Text variant="bodySm" fontWeight="medium" as="p">
              Product
            </Text>
            <Button fullWidth onClick={() => {}}>
              Select Product
            </Button>
          </BlockStack>
        );
      case "product_quantity_in_cart":
        return (
          <InlineGrid columns={2} gap="300">
            <Select
              label="When quantity is"
              options={COMPARISON_OPTIONS}
              value={e.comparison ?? ""}
              onChange={(v) => upd("comparison", v)}
            />
            <TextField
              label="Quantity"
              value={e.quantity ?? ""}
              onChange={(v) => upd("quantity", v)}
              type="number"
              autoComplete="off"
            />
          </InlineGrid>
        );
      case "no_of_products":
        return (
          <InlineGrid columns={2} gap="300">
            <Select
              label="When count is"
              options={COMPARISON_OPTIONS}
              value={e.comparison ?? ""}
              onChange={(v) => upd("comparison", v)}
            />
            <TextField
              label="Number"
              value={e.number ?? ""}
              onChange={(v) => upd("number", v)}
              type="number"
              autoComplete="off"
            />
          </InlineGrid>
        );
      case "no_of_gift_cards_applied":
        return (
          <InlineGrid columns={2} gap="300">
            <Select
              label="When count is"
              options={COMPARISON_OPTIONS}
              value={e.comparison ?? ""}
              onChange={(v) => upd("comparison", v)}
            />
            <TextField
              label="Count"
              value={e.count ?? ""}
              onChange={(v) => upd("count", v)}
              type="number"
              autoComplete="off"
            />
          </InlineGrid>
        );
      case "cart_attribute_key_value":
      case "cart_metafield_key_value":
        return (
          <InlineGrid columns={2} gap="300">
            <TextField
              label="Key"
              value={e.key ?? ""}
              onChange={(v) => upd("key", v)}
              autoComplete="off"
            />
            <TextField
              label="Value"
              value={e.value ?? ""}
              onChange={(v) => upd("value", v)}
              autoComplete="off"
            />
          </InlineGrid>
        );
      case "product_type_in_cart":
      case "product_type_not_in_cart":
        return (
          <TextField
            label="Product Type"
            value={e.text ?? ""}
            onChange={(v) => upd("text", v)}
            autoComplete="off"
          />
        );
      case "vendor_name_in_cart":
      case "vendor_name_not_in_cart":
        return (
          <TextField
            label="Vendor Name"
            value={e.text ?? ""}
            onChange={(v) => upd("text", v)}
            autoComplete="off"
          />
        );
      case "first_name":
        return (
          <TextField
            label="First Name"
            value={e.text ?? ""}
            onChange={(v) => upd("text", v)}
            autoComplete="off"
          />
        );
      case "last_name":
        return (
          <TextField
            label="Last Name"
            value={e.text ?? ""}
            onChange={(v) => upd("text", v)}
            autoComplete="off"
          />
        );
      case "shipping_address_1":
        return (
          <TextField
            label="Shipping Address 1"
            value={e.text ?? ""}
            onChange={(v) => upd("text", v)}
            autoComplete="off"
          />
        );
      case "shipping_address_2":
        return (
          <TextField
            label="Shipping Address 2"
            value={e.text ?? ""}
            onChange={(v) => upd("text", v)}
            autoComplete="off"
          />
        );
      case "shipping_country":
        return (
          <TextField
            label="Shipping Country"
            value={e.text ?? ""}
            onChange={(v) => upd("text", v)}
            autoComplete="off"
          />
        );
      case "shipping_state_province":
        return (
          <TextField
            label="Shipping State / Province"
            value={e.text ?? ""}
            onChange={(v) => upd("text", v)}
            autoComplete="off"
          />
        );
      case "shipping_delivery_method_title":
        return (
          <TextField
            label="Delivery Method Title"
            value={e.text ?? ""}
            onChange={(v) => upd("text", v)}
            autoComplete="off"
          />
        );
      case "payment_method_type":
        return (
          <TextField
            label="Payment Method Type"
            value={e.text ?? ""}
            onChange={(v) => upd("text", v)}
            autoComplete="off"
          />
        );
      case "payment_method_handle":
        return (
          <TextField
            label="Payment Method Handle"
            value={e.text ?? ""}
            onChange={(v) => upd("text", v)}
            autoComplete="off"
          />
        );
      case "discount_code":
        return (
          <TextField
            label="Discount Code"
            value={e.text ?? ""}
            onChange={(v) => upd("text", v)}
            autoComplete="off"
          />
        );
      case "discount_title":
        return (
          <TextField
            label="Discount Title"
            value={e.text ?? ""}
            onChange={(v) => upd("text", v)}
            autoComplete="off"
          />
        );
      case "product_discount_code":
        return (
          <TextField
            label="Product Discount Code"
            value={e.text ?? ""}
            onChange={(v) => upd("text", v)}
            autoComplete="off"
          />
        );
      case "product_discount_title":
        return (
          <TextField
            label="Product Discount Title"
            value={e.text ?? ""}
            onChange={(v) => upd("text", v)}
            autoComplete="off"
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (isDirty) {
      shopify.saveBar.show("blocks-save-bar");
    } else {
      shopify.saveBar.hide("blocks-save-bar");
    }
  }, [isDirty]);

  useEffect(() => {
    if (searchParams.get("browse") === "1") {
      setTemplateModalOpen(true);
      setSearchParams({}, { replace: true });
      return;
    }

    const templateId = searchParams.get("template");
    const templateName = searchParams.get("name");
    const templateCategory = searchParams.get("category");

    if (templateId && templateName && templateCategory) {
      const name = decodeURIComponent(templateName);
      const category = decodeURIComponent(templateCategory);
      setBlockName(name);
      setAddedBlocks([
        {
          instanceId: Date.now(),
          id: Number(templateId),
          name,
          category,
          active: true,
        },
      ]);
      setSearchParams({}, { replace: true });
    }
  }, []);

  const dismissFirstSaveTooltip = useCallback(() => {
    setShowFirstSaveTooltip(false);
  }, []);

  const handleSave = useCallback(() => {
    setSavedBlockId(String(Date.now()));
    shopify.saveBar.hide("blocks-save-bar");
    setShowFirstSaveTooltip(true);
  }, []);

  const handleCopyId = useCallback(() => {
    if (savedBlockId) {
      navigator.clipboard.writeText(savedBlockId);
      setCopyToastActive(true);
    }
  }, [savedBlockId]);

  const handleDiscard = useCallback(() => {
    setAddedBlocks([]);
    setBlockName("");
    setConditionalVisibility(false);
    setConditions([]);
    shopify.saveBar.hide("blocks-save-bar");
  }, []);

  const handleStatusChange = useCallback(
    (value: string) => setStatus(value),
    [],
  );
  const handleLayoutChange = useCallback(
    (value: string) => setLayoutType(value),
    [],
  );

  return (
    <Frame>
      <Page
        title={blockName || "New Checkout Block"}
        backAction={{ content: "Home", onAction: () => navigate("/app") }}
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
                icon={SearchIcon}
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
                  <BlockStack gap="400">
                    <InlineStack gap="400" blockAlign="start" wrap={false}>
                      <Toggle
                        checked={conditionalVisibility}
                        onChange={(val) => {
                          setConditionalVisibility(val);
                          if (!val) setConditions([]);
                        }}
                      />
                      <Text variant="bodyMd" fontWeight="semibold" as="p">
                        Enable conditional block visibility
                      </Text>
                    </InlineStack>
                    <Text variant="bodyMd" tone="subdued" as="p">
                      When enabled, blocks will only appear when your specified
                      conditions are met. When disabled, blocks are always
                      visible.
                    </Text>

                    {conditionalVisibility && (
                      <BlockStack gap="300">
                        {conditions.map((condition, index) => (
                          <Box
                            key={condition.id}
                            background="bg-surface-secondary"
                            borderRadius="200"
                            padding="400"
                          >
                            <BlockStack gap="300">
                              <Select
                                label="Condition"
                                options={CONDITION_OPTIONS}
                                value={condition.value}
                                onChange={(val) =>
                                  updateCondition(condition.id, val)
                                }
                              />
                              {renderConditionExtras(condition)}
                              <InlineStack align="space-between">
                                <InlineStack gap="100">
                                  {index > 0 && (
                                    <Button
                                      icon={ArrowUpIcon}
                                      size="slim"
                                      accessibilityLabel="Move up"
                                      onClick={() =>
                                        moveConditionUp(condition.id)
                                      }
                                    />
                                  )}
                                  {index < conditions.length - 1 && (
                                    <Button
                                      icon={ArrowDownIcon}
                                      size="slim"
                                      accessibilityLabel="Move down"
                                      onClick={() =>
                                        moveConditionDown(condition.id)
                                      }
                                    />
                                  )}
                                </InlineStack>
                                <Button
                                  icon={DeleteIcon}
                                  variant="tertiary"
                                  tone="critical"
                                  accessibilityLabel="Remove condition"
                                  onClick={() => removeCondition(condition.id)}
                                />
                              </InlineStack>
                            </BlockStack>
                          </Box>
                        ))}
                        <InlineStack align="end">
                          <Button variant="primary" onClick={addCondition}>
                            + Add new visibility condition
                          </Button>
                        </InlineStack>
                      </BlockStack>
                    )}
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
                                onAction: () => {
                                  setMenuOpen(false);
                                  setImportModalOpen(true);
                                },
                              },
                              {
                                content: "Export blocks",
                                icon: ExportIcon,
                                onAction: () => {
                                  setMenuOpen(false);
                                  setExportToastActive(true);
                                },
                              },
                            ]}
                          />
                        </Popover>
                      </InlineStack>
                    </InlineStack>

                    {/* Block list / empty state */}
                    {addedBlocks.length === 0 ? (
                      <div
                        style={{
                          border: "1px solid var(--p-color-border)",
                          borderRadius: "var(--p-border-radius-200)",
                          background: "var(--p-color-bg-surface-secondary)",
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
                    ) : (
                      <BlockStack gap="200">
                        {addedBlocks.map((block) => (
                          <div
                            key={block.instanceId}
                            style={{
                              border: "1px solid var(--p-color-border)",
                              borderRadius: "var(--p-border-radius-200)",
                              padding: "var(--p-space-300) var(--p-space-400)",
                              display: "flex",
                              alignItems: "center",
                              gap: "var(--p-space-300)",
                              background: "var(--p-color-bg-surface)",
                            }}
                          >
                            <Icon source={DragHandleIcon} tone="subdued" />
                            <Badge>
                              {block.name.toLowerCase().replace(/\s+/g, "_")}
                            </Badge>
                            <Text
                              variant="bodyMd"
                              fontWeight="semibold"
                              as="span"
                            >
                              {block.name}
                            </Text>
                            <div style={{ flex: 1 }} />
                            <Badge tone={block.active ? "success" : undefined}>
                              {block.active ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              icon={SettingsIcon}
                              variant="tertiary"
                              size="slim"
                              accessibilityLabel="Settings"
                              onClick={() => setEditingBlock(block)}
                            />
                            <Button
                              icon={block.active ? ViewIcon : HideIcon}
                              variant="tertiary"
                              size="slim"
                              accessibilityLabel={
                                block.active ? "Disable block" : "Enable block"
                              }
                              onClick={() =>
                                setAddedBlocks((prev) =>
                                  prev.map((b: AddedBlock) =>
                                    b.instanceId === block.instanceId
                                      ? { ...b, active: !b.active }
                                      : b,
                                  ),
                                )
                              }
                            />
                            <Button
                              icon={DeleteIcon}
                              variant="tertiary"
                              size="slim"
                              tone="critical"
                              accessibilityLabel="Delete"
                              onClick={() =>
                                setAddedBlocks((prev) =>
                                  prev.filter(
                                    (b) => b.instanceId !== block.instanceId,
                                  ),
                                )
                              }
                            />
                          </div>
                        ))}
                      </BlockStack>
                    )}

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
                    {savedBlockId && showFirstSaveTooltip && (
                      <Box
                        background="bg-surface-secondary"
                        borderRadius="200"
                        padding="300"
                      >
                        <BlockStack gap="200">
                          <InlineStack align="space-between" blockAlign="start">
                            <InlineStack gap="150" blockAlign="center">
                              <Icon source={PlanFilledIcon} tone="success" />
                              <Text
                                variant="bodySm"
                                fontWeight="semibold"
                                as="p"
                              >
                                Last Step
                              </Text>
                            </InlineStack>
                            <Button
                              icon={XSmallIcon}
                              variant="tertiary"
                              size="slim"
                              accessibilityLabel="Dismiss"
                              onClick={dismissFirstSaveTooltip}
                            />
                          </InlineStack>
                          <Text variant="bodySm" tone="subdued" as="p">
                            Open the Checkout Editor, select a placement, and
                            paste your Block ID to activate it for shoppers.
                          </Text>
                        </BlockStack>
                      </Box>
                    )}
                    <Text variant="headingSm" as="h3">
                      Block Details
                    </Text>
                    <Text variant="bodyMd" tone="subdued" as="p">
                      {savedBlockId
                        ? "Your block is saved and ready to deploy."
                        : "After saving, you'll receive a unique Block ID for this block."}
                    </Text>
                    {savedBlockId && (
                      <InlineStack gap="200" blockAlign="center">
                        <Tooltip active content="Copy Your Block ID">
                          <Text
                            variant="headingMd"
                            fontWeight="medium"
                            tone="success"
                            as="p"
                          >
                            <span
                              style={{
                                fontFamily: "var(--p-font-family-mono)",
                              }}
                            >
                              {savedBlockId}
                            </span>
                          </Text>
                        </Tooltip>
                        <Button
                          icon={ClipboardIcon}
                          variant="tertiary"
                          size="slim"
                          accessibilityLabel="Copy block ID"
                          onClick={handleCopyId}
                        />
                      </InlineStack>
                    )}
                    <Button
                      variant={savedBlockId ? "primary" : undefined}
                      disabled={!savedBlockId}
                      icon={savedBlockId ? ExternalIcon : undefined}
                      onClick={
                        savedBlockId ? dismissFirstSaveTooltip : undefined
                      }
                    >
                      Open Checkout Editor
                    </Button>
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
          onSelect={(template) => {
            setBlockName(template.name);
            setAddedBlocks((prev) => [
              ...prev,
              {
                instanceId: Date.now(),
                id: template.id,
                name: template.name,
                category: template.category,
                active: true,
              },
            ]);
          }}
        />

        <ImportModal
          open={importModalOpen}
          onClose={() => setImportModalOpen(false)}
        />

        <AddBlockModal
          open={addBlockModalOpen}
          onClose={() => setAddBlockModalOpen(false)}
          onAdd={(block) => setAddedBlocks((prev) => [...prev, block])}
        />

        <BlockEditModal
          block={editingBlock}
          onClose={() => setEditingBlock(null)}
        />

        {saveToastActive && (
          <Toast
            content="Block saved successfully"
            onDismiss={() => setSaveToastActive(false)}
          />
        )}
        {exportToastActive && (
          <Toast
            content="Downloading..."
            onDismiss={() => setExportToastActive(false)}
          />
        )}
        {copyToastActive && (
          <Toast
            content="Block ID copied to clipboard"
            onDismiss={() => setCopyToastActive(false)}
          />
        )}
      </Page>

      <ui-save-bar id="blocks-save-bar">
        <button variant="primary" onClick={handleSave}>
          Save
        </button>
        <button onClick={handleDiscard}>Discard</button>
      </ui-save-bar>
    </Frame>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
