import { redirect } from "react-router";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.searchParams);
  params.delete("appLoadId");
  throw redirect(`/app${params.toString() ? `?${params.toString()}` : ""}`);
};

export default function App() {
  return null;
}
