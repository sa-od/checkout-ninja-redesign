import { useState, useRef } from "react";
import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useNavigate } from "react-router";
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
  EmptyState,
  InlineGrid,
  Divider,
  Icon,
  MediaCard,
  Modal,
} from "@shopify/polaris";
import {
  ThemeTemplateIcon,
  EditIcon,
  ExportIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@shopify/polaris-icons";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

// ── Data ──────────────────────────────────────────────────────────────────────

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
    name: "Customs Duties & Tax Guarantee Notice",
    image: "/Templates/template6.png",
  },
];

const USE_CASES = [
  {
    id: "1",
    brand: "Feetly",
    description:
      "How Feetly increased average order value using upsell blocks at checkout",
    image: "/Example/example1.png",
    caseStudy:
      "Feetly integrated Checkout Ninja's upsell blocks to recommend complementary products at the final step of checkout. By showing targeted add-ons based on cart contents, they saw a 23% lift in average order value within the first 30 days — without any code changes.",
  },
  {
    id: "2",
    brand: "Nuvita",
    description:
      "How Nuvita builds customer trust with social proof and payment badges",
    image: "/Example/example2.png",
    caseStudy:
      "Nuvita used Checkout Ninja to add trust badges, accepted payment icons, and a Google Review testimonial directly to their checkout page. The result was a 15% reduction in cart abandonment, as customers felt more confident completing their purchase.",
  },
];

export default function Index() {
  const navigate = useNavigate();
  const goToCreateBlock = () => navigate("/app/blocks?browse=1");
  const [activeCaseStudyId, setActiveCaseStudyId] = useState<string | null>(null);
  const [showArrows, setShowArrows] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (dir: "left" | "right") => {
    carouselRef.current?.scrollBy({ left: dir === "left" ? -260 : 260, behavior: "smooth" });
  };

  const activeCaseStudy =
    USE_CASES.find((uc) => uc.id === activeCaseStudyId) ?? null;

  return (
    <Page
      title="Checkout Blocks"
      primaryAction={{ content: "+ Create block", onAction: goToCreateBlock }}
    >
      <BlockStack gap="600">
        {/* ── Empty state ── */}
        <Card padding="0">
          <EmptyState
            heading="No checkout blocks yet"
            action={{ content: "+ Create block", onAction: goToCreateBlock }}
            // secondaryAction={{
            //   content: "Browse templates",
            //   onAction: goToCreateBlock,
            // }}
            image="/empty-state.png"
            imageContained
          >
            <InlineGrid columns={3} gap="400">
              {[
                { icon: ThemeTemplateIcon, label: "Pick a template" },
                { icon: EditIcon, label: "Configure & preview" },
                { icon: ExportIcon, label: "Publish to checkout" },
              ].map(({ icon, label }, i) => (
                <Box
                  key={i}
                  background="bg-surface-secondary"
                  borderRadius="200"
                  padding="300"
                >
                  <BlockStack gap="150" inlineAlign="center">
                    <Icon source={icon} tone="base" />
                    <Text
                      variant="bodySm"
                      fontWeight="medium"
                      as="p"
                      alignment="center"
                    >
                      {label}
                    </Text>
                  </BlockStack>
                </Box>
              ))}
            </InlineGrid>
          </EmptyState>
        </Card>

        {/* ── Templates carousel ── */}
        <Text variant="headingMd" as="h2">
          Ready-to-use templates
        </Text>
        <Card>
          <BlockStack gap="400">
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setShowArrows(true)}
              onMouseLeave={() => setShowArrows(false)}
            >
              {/* Left arrow */}
              <div
                style={{
                  position: "absolute",
                  left: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  opacity: showArrows ? 1 : 0,
                  transition: "opacity 0.15s",
                  pointerEvents: showArrows ? "auto" : "none",
                  background: "var(--p-color-bg-surface)",
                  borderRadius: "50%",
                  boxShadow: "var(--p-shadow-200)",
                  border: "1px solid var(--p-color-border)",
                  overflow: "hidden",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  icon={ChevronLeftIcon}
                  accessibilityLabel="Scroll left"
                  variant="tertiary"
                  onClick={() => scrollCarousel("left")}
                />
              </div>

              {/* Right arrow */}
              <div
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  opacity: showArrows ? 1 : 0,
                  transition: "opacity 0.15s",
                  pointerEvents: showArrows ? "auto" : "none",
                  background: "var(--p-color-bg-surface)",
                  borderRadius: "50%",
                  boxShadow: "var(--p-shadow-200)",
                  border: "1px solid var(--p-color-border)",
                  overflow: "hidden",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  icon={ChevronRightIcon}
                  accessibilityLabel="Scroll right"
                  variant="tertiary"
                  onClick={() => scrollCarousel("right")}
                />
              </div>

              <div
                ref={carouselRef}
                style={{
                  display: "flex",
                  gap: "var(--p-space-400)",
                  overflowX: "auto",
                  paddingBottom: "var(--p-space-200)",
                  scrollSnapType: "x mandatory",
                }}
              >
              {TEMPLATES.map((item) => (
                <div
                  key={item.id}
                  style={{
                    minWidth: "220px",
                    flex: "0 0 auto",
                    border: "1px solid var(--p-color-border)",
                    borderRadius: "var(--p-border-radius-300)",
                    overflow: "hidden",
                    background: "var(--p-color-bg-surface)",
                    display: "flex",
                    flexDirection: "column",
                    scrollSnapAlign: "start",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "150px",
                      display: "block",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "var(--p-space-400)",
                      borderTop: "1px solid var(--p-color-border)",
                      gap: "var(--p-space-300)",
                    }}
                  >
                    <Text variant="headingSm" as="h3">
                      {item.name}
                    </Text>
                    <Button variant="primary" size="slim">
                      Use Template
                    </Button>
                  </div>
                </div>
              ))}
              </div>
            </div>
            <InlineStack align="end">
              <Button variant="secondary" size="slim">
                View all Templates
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>

        {/* ── Live examples ── */}
        <BlockStack gap="200">
          <Text variant="headingLg" as="h2">
            Live examples
          </Text>
          <Text variant="bodyMd" tone="subdued" as="p">
            See how merchants use Checkout Ninja to improve their checkout
          </Text>
        </BlockStack>

        <InlineGrid columns={{ xs: 1, md: 2 }} gap="400">
          <div style={{ height: "100%" }}>
            <MediaCard
              title="Feetly"
              description="How Feetly increased average order value using upsell blocks at checkout"
              primaryAction={{
                content: "View case study",
                onAction: () => setActiveCaseStudyId("1"),
              }}
            >
              <img
                src="/Example/example1.png"
                alt="Feetly"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  objectPosition: "top",
                  display: "block",
                }}
              />
            </MediaCard>
          </div>
          <div style={{ height: "100%" }}>
            <MediaCard
              title="Nuvita"
              description="How Nuvita builds customer trust with social proof and payment badges"
              primaryAction={{
                content: "View case study",
                onAction: () => setActiveCaseStudyId("2"),
              }}
            >
              <img
                src="/Example/example2.png"
                alt="Nuvita"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  objectPosition: "top",
                  display: "block",
                }}
              />
            </MediaCard>
          </div>
        </InlineGrid>

        <Divider />
      </BlockStack>

      {activeCaseStudy && (
        <Modal
          open={!!activeCaseStudy}
          onClose={() => setActiveCaseStudyId(null)}
          title={activeCaseStudy.brand}
          secondaryActions={[
            { content: "Close", onAction: () => setActiveCaseStudyId(null) },
          ]}
        >
          <Modal.Section flush>
            <img
              src={activeCaseStudy.image}
              alt={activeCaseStudy.brand}
              style={{
                width: "100%",
                display: "block",
              }}
            />
          </Modal.Section>
          <Modal.Section>
            <BlockStack gap="400">
              <BlockStack gap="100">
                <Text variant="bodySm" tone="subdued" as="p">
                  Case Study
                </Text>
                <Text variant="headingMd" as="h2">
                  {activeCaseStudy.brand}
                </Text>
              </BlockStack>
              <Text variant="bodyMd" tone="subdued" as="p">
                {activeCaseStudy.description}
              </Text>
              <Divider />
              <Text variant="bodyMd" tone="subdued" as="p">
                {activeCaseStudy.caseStudy}
              </Text>
            </BlockStack>
          </Modal.Section>
        </Modal>
      )}
    </Page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
