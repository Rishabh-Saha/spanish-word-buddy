import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import FlashCard from "./FlashCard";
import { Flashcard } from "@/data/flashcards";
import { useUpdateCardStatus } from "@/hooks/useUpdateCardStatus";

interface VocabularyModeProps {
  flashcards: Flashcard[];
}

const VocabularyMode = ({ flashcards }: VocabularyModeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<number>>(new Set());
  const [key, setKey] = useState(0);
  const cardsReviewedSinceLastUpdate = useRef(0);

  const { mutate: updateCardStatus } = useUpdateCardStatus();

  // Filter to show only not learned flashcards
  // sort based on review added row_number
  const notKnownFlashcards = useMemo(
    () =>
      flashcards
        .filter((card) => !card.known)
        .slice()
        .sort((a, b) => a.row_number - b.row_number),
    [flashcards]
  );

  const currentCard = notKnownFlashcards[currentIndex];
  const progress = ((currentIndex + 1) / notKnownFlashcards.length) * 100;

  const goToNext = () => {
    if (currentIndex < notKnownFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setKey((prev) => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setKey((prev) => prev + 1);
    }
  };

  const handleKnown = () => {
    setKnownCards((prev) => new Set(prev).add(currentCard.row_number));
    setUnknownCards((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.row_number);
      return next;
    });
    cardsReviewedSinceLastUpdate.current += 1;
    goToNext();
  };

  const handleUnknown = () => {
    setUnknownCards((prev) => new Set(prev).add(currentCard.row_number));
    setKnownCards((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.row_number);
      return next;
    });
    cardsReviewedSinceLastUpdate.current += 1;
    goToNext();
  };

  const resetProgress = () => {
    // Update backend before resetting
    if (flashcards.length > 0) {
      const updates = [
        ...Array.from(flashcards).map(({ row_number }) => ({
          row_number,
          known: false,
        })),
      ];
      updateCardStatus(updates);
    }

    setCurrentIndex(0);
    setKnownCards(new Set());
    setUnknownCards(new Set());
    setKey((prev) => prev + 1);
    cardsReviewedSinceLastUpdate.current = 0;
  };

  // Update backend with known/unknown status every 10 cards or on reset
  useEffect(() => {
    if (cardsReviewedSinceLastUpdate.current >= 10) {
      const updates = [
        ...Array.from(knownCards).map((row_number) => ({
          row_number,
          known: true,
        })),
        ...Array.from(unknownCards).map((row_number) => ({
          row_number,
          known: false,
        })),
      ];
      updateCardStatus(updates);
      cardsReviewedSinceLastUpdate.current = 0;
    }
  }, [currentIndex, knownCards, unknownCards, updateCardStatus]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>
            Card {currentIndex + 1} of {notKnownFlashcards.length}
          </span>
          <span className="flex gap-4">
            <span className="text-success">Known: {knownCards.size}</span>
            <span className="text-destructive">
              Learning: {unknownCards.size}
            </span>
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center">
        <div key={key} className="animate-slide-in w-full">
          <FlashCard
            card={currentCard}
            showActions
            onKnown={handleKnown}
            onUnknown={handleUnknown}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="p-3 rounded-xl bg-secondary text-secondary-foreground transition-all hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={resetProgress}
          className="px-4 py-3 rounded-xl bg-secondary text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-95 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm font-medium">Reset All</span>
        </button>

        <button
          onClick={goToNext}
          disabled={currentIndex === notKnownFlashcards.length - 1}
          className="p-3 rounded-xl bg-secondary text-secondary-foreground transition-all hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default VocabularyMode;
