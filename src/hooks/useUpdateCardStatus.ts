import { useMutation } from "@tanstack/react-query";

const WEBHOOK_URL = "https://rishabh-saha.app.n8n.cloud/webhook-test/vocabulary/spanish/update";

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

export interface CardStatus {
  row_number: number;
  known: boolean;
}

export const useUpdateCardStatus = () => {
  return useMutation({
    mutationFn: async (data: CardStatus[]) => {
      const authHeader = createAuthHeader();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update card status");
      }
      return response.json();
    },
    onSuccess: () => {
      console.log("Card status updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update card status:", error);
    },
  });
};
