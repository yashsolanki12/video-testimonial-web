import { useRouteLoaderData, useSearchParams } from "react-router";

export const useCurrentShopDomain = () => {
  const [searchParams] = useSearchParams();
  const appData = useRouteLoaderData("routes/app");
  return searchParams.get("shop") || appData?.shop || "";
};

export const extractVideoEmbedUrl = (url, type) => {
  if (type === "youtube") {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?#]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  }

  if (type === "vimeo") {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : url;
  }

  return url;
};
