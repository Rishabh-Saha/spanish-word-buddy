import { useQuery } from "@tanstack/react-query";
import { Flashcard } from "@/data/flashcards";

const WEBHOOK_URL = "https://your-n8n-instance.app.n8n.cloud/webhook/your-webhook-id";

export const useFlashcards = () => {
  return useQuery<Flashcard[]>({
    queryKey: ["flashcards"],
    queryFn: async () => {
      const response = await fetch(WEBHOOK_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch flashcards");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
