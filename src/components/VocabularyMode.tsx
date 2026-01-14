import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, List, Layers, Volume2 } from "lucide-react";
import FlashCard from "./FlashCard";
import { Flashcard } from "@/data/flashcards";
import { useUpdateCardStatus } from "@/hooks/useUpdateCardStatus";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface VocabularyModeProps {
  flashcards: Flashcard[];
}

const VocabularyMode = ({ flashcards }: VocabularyModeProps) => {
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  
  // Filter to show only not learned flashcards
  const notKnownFlashcards = useMemo(
    () => flashcards.filter((card) => card.known === false),
    [flashcards]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<number>>(new Set());
  const [key, setKey] = useState(0);
  const cardsReviewedSinceLastUpdate = useRef(0);

  const { mutate: updateCardStatus } = useUpdateCardStatus();
  const { speak } = useTextToSpeech();

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

  const handleSelectCard = (index: number) => {
    setCurrentIndex(index);
    setKey((prev) => prev + 1);
    setViewMode("cards");
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      {/* View Toggle & Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "cards"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <Layers className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <span className="flex gap-4 text-sm text-muted-foreground">
            <span className="text-success">Known: {knownCards.size}</span>
            <span className="text-destructive">Learning: {unknownCards.size}</span>
          </span>
        </div>

        {viewMode === "cards" && (
          <>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>
                Card {currentIndex + 1} of {notKnownFlashcards.length}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}
      </div>

      {viewMode === "cards" ? (
        <>
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
        </>
      ) : (
        /* Word List View */
        <div className="flex-1 overflow-auto">
          <div className="grid gap-2">
            {notKnownFlashcards.map((card, index) => (
              <div
                key={card.row_number}
                onClick={() => handleSelectCard(index)}
                className={`p-4 rounded-xl bg-card border border-border cursor-pointer transition-all hover:bg-secondary/50 hover:border-primary/50 ${
                  knownCards.has(card.row_number)
                    ? "border-l-4 border-l-success"
                    : unknownCards.has(card.row_number)
                    ? "border-l-4 border-l-destructive"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-foreground">
                        {card.spanish}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(card.spanish);
                        }}
                        className="p-1 rounded-full hover:bg-secondary transition-colors"
                      >
                        <Volume2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {card.english}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyMode;
