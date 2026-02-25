import { useEffect } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import db from "../db.server";

/* =========================
   LOADER – Get Metafield
========================= */
export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  
  const response = await admin.graphql(`
    {
      shop {
        metafield(namespace: "my_app", key: "announcement") {
          value
        }
      }
    }
  `);

  const data = await response.json();

  return {
    announcement: data.data.shop.metafield?.value || "",
  };
};

/* =========================
   ACTION – Save Data
========================= */
export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const text = formData.get("announcement");

  if (!text) {
    return { error: "Announcement text required" };
  }

  try {
   
    await db.announcement.create({
      data: {
        shop: session.shop,
        text,
      },
    });

   
    const shopResponse = await admin.graphql(`
      {
        shop {
          id
        }
      }
    `);

    const shopData = await shopResponse.json();
    const shopId = shopData.data.shop.id;

  
    await admin.graphql(
      `#graphql
      mutation SetAnnouncement($text: String!, $ownerId: ID!) {
        metafieldsSet(metafields: [{
          namespace: "my_app",
          key: "announcement",
          type: "single_line_text_field",
          value: $text,
          ownerId: $ownerId
        }]) {
          metafields {
            id
            value
          }
          userErrors {
            message
          }
        }
      }`,
      {
        variables: {
          text,
          ownerId: shopId,
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to save announcement" };
  }
};

/* =========================
   COMPONENT
========================= */
export default function Index() {
  const fetcher = useFetcher();
  const { announcement } = useLoaderData();
  const shopify = useAppBridge();

  console.log("Loader Announcement:", useLoaderData());

  useEffect(() => {
    if (fetcher.data?.success) {
      shopify.toast.show("Announcement Saved!");
    }
    if (fetcher.data?.error) {
      shopify.toast.show(fetcher.data.error, { isError: true });
    }
  }, [fetcher.data, shopify]);

  return (
    <s-page heading="Announcement Manager">
      <fetcher.Form method="post">
        <s-section>
          <s-text-field
            name="announcement"
            label="Announcement Text"
            placeholder="Enter announcement..."
            defaultValue={announcement}
          />
        </s-section>

        <s-button type="submit" variant="primary">
          Save
        </s-button>
      </fetcher.Form>
    </s-page>
  );
}

/* =========================
   HEADERS
========================= */
export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};