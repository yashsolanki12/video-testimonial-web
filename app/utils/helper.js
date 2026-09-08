import { useRouteLoaderData, useSearchParams } from "react-router";

export const useCurrentShopDomain = () => {
  const [searchParams] = useSearchParams();
  const appData = useRouteLoaderData("routes/app");
  return searchParams.get("shop") || appData?.shop || "";
};

export const extractVideoEmbedUrl = (url, type) => {
  if (type === "youtube") {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?#]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  }

  if (type === "vimeo") {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : url;
  }

  return url;
};

export const getVideoThumbnail = (url, type) => {
  if (type === "youtube") {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?#]+)/
    );
    return match
      ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`
      : null;
  }

  if (type === "vimeo") {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match
      ? `https://vumbnail.com/${match[1]}.jpg`
      : null;
  }

  return null;
};

export const isShopifyVideo = (url) => {
  return url?.includes("cdn.shopify.com/videos") || false;
};

export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec",
  ];
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};
