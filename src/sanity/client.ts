import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "nfeu7bbc",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});