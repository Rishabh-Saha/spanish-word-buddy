import { useState } from "react";
import { Flashcard } from "@/data/flashcards";

interface FlashCardProps {
  card: Flashcard;
  showActions?: boolean;
  onKnown?: () => void;
  onUnknown?: () => void;
}

const FlashCard = ({ card, showActions = false, onKnown, onUnknown }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className="perspective cursor-pointer"
        onClick={handleFlip}
      >
        <div className={`flip-card-inner relative w-full h-80 ${isFlipped ? 'flipped' : ''}`}>
          {/* Front of card - Spanish word */}
          <div className="absolute inset-0 backface-hidden">
            <div className="h-full bg-card rounded-2xl card-shadow p-8 flex flex-col items-center justify-center border border-border transition-shadow hover:card-shadow-hover">
              <span className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Español
              </span>
              <h2 className="font-display text-4xl font-semibold text-foreground text-center leading-tight">
                {card.spanish}
              </h2>
              <p className="text-sm text-muted-foreground mt-6">
                Tap to reveal translation
              </p>
            </div>
          </div>

          {/* Back of card - English + Usage */}
          <div className="absolute inset-0 backface-hidden rotate-y-180">
            <div className="h-full bg-card rounded-2xl card-shadow p-8 flex flex-col items-center justify-center border border-border transition-shadow hover:card-shadow-hover">
              <span className="text-xs uppercase tracking-widest text-primary mb-2">
                English
              </span>
              <h2 className="font-display text-3xl font-semibold text-foreground text-center mb-6">
                {card.english}
              </h2>
              <div className="w-16 h-px bg-border mb-6" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Usage
              </span>
              <p className="text-sm text-secondary-foreground text-center italic leading-relaxed">
                {card.usage}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(false);
              onUnknown?.();
            }}
            className="px-6 py-3 rounded-xl bg-destructive/10 text-destructive font-medium transition-all hover:bg-destructive hover:text-destructive-foreground active:scale-95"
          >
            Still Learning
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(false);
              onKnown?.();
            }}
            className="px-6 py-3 rounded-xl bg-success/10 text-success font-medium transition-all hover:bg-success hover:text-success-foreground active:scale-95"
          >
            I Know This
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashCard;
