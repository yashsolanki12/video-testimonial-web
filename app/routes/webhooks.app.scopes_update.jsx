import { authenticate, sessionStorage } from "../shopify.server";

export const action = async ({ request }) => {
  const { payload, session, topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);
  const current = payload.current;

  if (session) {
    const loadedSession = await sessionStorage.loadSession(session.id);
    if (loadedSession) {
      loadedSession.scope = current.toString();
      await sessionStorage.storeSession(loadedSession);
    }
  }

  return new Response();
};
