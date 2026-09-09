import { useRouteLoaderData, useSearchParams } from "react-router";

export const useCurrentShopDomain = () => {
  const [searchParams] = useSearchParams();
  const appData = useRouteLoaderData("routes/app");
  return searchParams.get("shop") || appData?.shop || "";
};

export const detectVideoType = (url) => {
  if (!url) return "other";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  if (url.includes("cdn.shopify.com/videos")) return "shopify";
  return "other";
};

export const extractVideoEmbedUrl = (url) => {
  const videoType = detectVideoType(url);

  if (videoType === "youtube") {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?#]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  }

  if (videoType === "vimeo") {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : url;
  }

  return url;
};

export const getVideoThumbnail = (url) => {
  const videoType = detectVideoType(url);

  if (videoType === "youtube") {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?#]+)/
    );
    return match
      ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`
      : null;
  }

  if (videoType === "vimeo") {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://vumbnail.com/${match[1]}.jpg` : null;
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
