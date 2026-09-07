import { authenticate, sessionStorage } from "../shopify.server";

export const action = async ({ request }) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Clean up backend data (testimonials + settings)
  try {
    const backendUrl = import.meta.env.BACKEND_API_URL || "http://localhost:5000";
    await fetch(`${backendUrl}/api/webhooks/uninstall`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop }),
    });
    console.log(`Backend cleanup completed for ${shop}`);
  } catch (error) {
    console.error("Backend cleanup failed:", error);
  }

  // Delete all sessions for this shop
  if (session) {
    const sessions = await sessionStorage.findSessionsByShop(shop);
    for (const s of sessions) {
      await sessionStorage.deleteSession(s.id);
    }
  }

  return new Response();
};
