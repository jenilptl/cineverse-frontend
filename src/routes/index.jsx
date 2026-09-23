import { createFileRoute } from "@tanstack/react-router";
import App from "../App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReelMind — Movie Recommendations" },
      { name: "description", content: "Search movies and explore machine-learning recommendations in a simple cinema-inspired interface." },
      { property: "og:title", content: "ReelMind — Movie Recommendations" },
      { property: "og:description", content: "A friendly movie search and recommendation interface for a clustering project." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});
