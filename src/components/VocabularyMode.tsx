import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import FlashCard from "./FlashCard";
import { flashcards, Flashcard } from "@/data/flashcards";

const VocabularyMode = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<number>>(new Set());
  const [key, setKey] = useState(0);

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const goToNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setKey(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setKey(prev => prev + 1);
    }
  };

  const handleKnown = () => {
    setKnownCards(prev => new Set(prev).add(currentCard.id));
    setUnknownCards(prev => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    goToNext();
  };

  const handleUnknown = () => {
    setUnknownCards(prev => new Set(prev).add(currentCard.id));
    setKnownCards(prev => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    goToNext();
  };

  const resetProgress = () => {
    setCurrentIndex(0);
    setKnownCards(new Set());
    setUnknownCards(new Set());
    setKey(prev => prev + 1);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Card {currentIndex + 1} of {flashcards.length}</span>
          <span className="flex gap-4">
            <span className="text-success">Known: {knownCards.size}</span>
            <span className="text-destructive">Learning: {unknownCards.size}</span>
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
          <span className="text-sm font-medium">Reset</span>
        </button>

        <button
          onClick={goToNext}
          disabled={currentIndex === flashcards.length - 1}
          className="p-3 rounded-xl bg-secondary text-secondary-foreground transition-all hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default VocabularyMode;
