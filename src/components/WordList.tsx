import { Volume2 } from "lucide-react";
import { Flashcard } from "@/data/flashcards";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface WordListProps {
  flashcards: Flashcard[];
}

const WordList = ({ flashcards }: WordListProps) => {
  const { speak } = useTextToSpeech();

  const knownCount = flashcards.filter((card) => card.known === true).length;
  const learningCount = flashcards.filter((card) => card.known === false).length;

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      {/* Stats Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">
            All Words ({flashcards.length})
          </h2>
          <span className="flex gap-4 text-sm text-muted-foreground">
            <span className="text-success">Known: {knownCount}</span>
            <span className="text-destructive">Learning: {learningCount}</span>
          </span>
        </div>
      </div>

      {/* Word List */}
      <div className="flex-1 overflow-auto">
        <div className="grid gap-2">
          {flashcards.map((card) => (
            <div
              key={card.row_number}
              className={`p-4 rounded-xl bg-card border border-border transition-all hover:bg-secondary/50 ${
                card.known === true
                  ? "border-l-4 border-l-success"
                  : "border-l-4 border-l-destructive"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-foreground">
                      {card.spanish}
                    </span>
                    <button
                      onClick={() => speak(card.spanish)}
                      className="p-1 rounded-full hover:bg-secondary transition-colors"
                    >
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {card.english}
                  </span>
                  {card.usage && (
                    <p className="text-xs text-muted-foreground/70 mt-1 italic">
                      "{card.usage}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordList;
