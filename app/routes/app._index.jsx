import { useEffect } from "react";
import { useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();
  const product = responseJson.data.productCreate.product;

  return { product }
}

export default function Index() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  useEffect(() => {
    if (fetcher.data?.product?.id) {
      shopify.toast.show("Product created");
    }
  }, [fetcher.data?.product?.id, shopify]);

  const generateProduct = () => fetcher.submit({}, { method: "POST" });

  return (
    <s-page heading="Video Testimonial App">
      <s-section heading="Welcome to Video Testimonial App">
        <s-paragraph>
          Manage video testimonials for your Shopify store. Add, edit, and
          configure how testimonials appear on your storefront.
        </s-paragraph>
      </s-section>

      <s-section heading="Quick Actions">
        <s-stack direction="inline" gap="base">
          <s-button
            onClick={() => {
              window.location.href = "/app/testimonials";
            }}
          >
            Manage Testimonials
          </s-button>
          <s-button
            onClick={() => {
              window.location.href = "/app/settings";
            }}
            variant="tertiary"
          >
            Configure Settings
          </s-button>
          <s-button
            onClick={() => {
              window.location.href = "/app/storefront";
            }}
            variant="tertiary"
          >
            Preview Storefront
          </s-button>
        </s-stack>
      </s-section>

      <s-section heading="Features">
        <s-unordered-list>
          <s-list-item>
            Add up to 10 video testimonials (YouTube, Vimeo, or Shopify videos)
          </s-list-item>
          <s-list-item>
            Customize section title and display layout (Slider or Grid)
          </s-list-item>
          <s-list-item>
            Three slider effects: Standard, Fade, and Carousel
          </s-list-item>
          <s-list-item>
            Responsive design for desktop, tablet, and mobile
          </s-list-item>
          <s-list-item>
            Embeddable storefront section for your theme
          </s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section heading="Generate a Product (Template Demo)">
        <s-paragraph>
          This is a demo feature from the Shopify app template.
        </s-paragraph>
        <s-button
          onClick={generateProduct}
          {...(isLoading ? { loading: true } : {})}
        >
          Generate a product
        </s-button>
        {fetcher.data?.product && (
          <s-box
            padding="base"
            borderWidth="base"
            borderRadius="base"
            background="subdued"
            sx={{ mt: 2 }}
          >
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              <code>{JSON.stringify(fetcher.data.product, null, 2)}</code>
            </pre>
          </s-box>
        )}
      </s-section>

      <s-section slot="aside" heading="Navigation">
        <s-unordered-list>
          <s-list-item>
            <s-link href="/app/testimonials">Manage Testimonials</s-link>
          </s-list-item>
          <s-list-item>
            <s-link href="/app/settings">Configure Settings</s-link>
          </s-list-item>
          <s-list-item>
            <s-link href="/app/storefront">Preview Storefront</s-link>
          </s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section slot="aside" heading="App Info">
        <s-paragraph>
          <s-text>Backend: </s-text>
          <s-text>Express + TypeScript + MongoDB + Mongoose</s-text>
        </s-paragraph>
        <s-paragraph>
          <s-text>Frontend: </s-text>
          <s-text>React Router + MUI + TanStack Query</s-text>
        </s-paragraph>
      </s-section>
    </s-page>
  )
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
