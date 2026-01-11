import { useQuery } from "@tanstack/react-query";
import { Flashcard } from "@/data/flashcards";

const WEBHOOK_URL = "https://rishabh-saha.app.n8n.cloud/webhook-test/vocabulary/spanish";

// Get credentials from environment variables
const USERNAME = import.meta.env.VITE_WEBHOOK_USERNAME;
const PASSWORD = import.meta.env.VITE_WEBHOOK_PASSWORD;

// Create Basic Auth header
const createAuthHeader = () => {
  if (!USERNAME || !PASSWORD) {
    console.warn("Webhook credentials not configured");
    return "";
  }
  const credentials = btoa(`${USERNAME}:${PASSWORD}`);
  return `Basic ${credentials}`;
};

export const useFlashcards = () => {
  return useQuery<Flashcard[]>({
    queryKey: ["flashcards"],
    queryFn: async () => {
      const authHeader = createAuthHeader();
      const headers: HeadersInit = {};
      
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }

      const response = await fetch(WEBHOOK_URL, {
        headers,
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch flashcards");
      }
      return response.json();
    },
    staleTime: 15 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
