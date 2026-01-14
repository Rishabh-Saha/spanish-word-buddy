import { useState, useMemo } from "react";
import { Volume2, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Flashcard } from "@/data/flashcards";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface WordListProps {
  flashcards: Flashcard[];
}

type Difficulty = "easy" | "medium" | "hard";

const difficultyConfig: Record<Difficulty, { label: string; color: string; bgColor: string }> = {
  easy: { label: "Easy", color: "text-success", bgColor: "bg-success/10" },
  medium: { label: "Medium", color: "text-warning", bgColor: "bg-warning/10" },
  hard: { label: "Hard", color: "text-destructive", bgColor: "bg-destructive/10" },
};

const WordList = ({ flashcards }: WordListProps) => {
  const { speak } = useTextToSpeech();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<Difficulty, boolean>>({
    easy: true,
    medium: true,
    hard: true,
  });

  // Filter by search query
  const filteredFlashcards = useMemo(() => {
    if (!searchQuery.trim()) return flashcards;
    const query = searchQuery.toLowerCase();
    return flashcards.filter(
      (card) =>
        card.spanish.toLowerCase().includes(query) ||
        card.english.toLowerCase().includes(query)
    );
  }, [flashcards, searchQuery]);

  // Group by difficulty
  const groupedFlashcards = useMemo(() => {
    const groups: Record<Difficulty, Flashcard[]> = {
      easy: [],
      medium: [],
      hard: [],
    };

    filteredFlashcards.forEach((card) => {
      const difficulty = card.difficulty || "medium";
      groups[difficulty].push(card);
    });

    return groups;
  }, [filteredFlashcards]);

  const toggleSection = (difficulty: Difficulty) => {
    setExpandedSections((prev) => ({
      ...prev,
      [difficulty]: !prev[difficulty],
    }));
  };

  const knownCount = flashcards.filter((card) => card.known === true).length;
  const learningCount = flashcards.filter((card) => card.known === false).length;

  const renderWordCard = (card: Flashcard) => (
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
          <span className="text-sm text-muted-foreground">{card.english}</span>
          {card.usage && (
            <p className="text-xs text-muted-foreground/70 mt-1 italic">
              "{card.usage}"
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search in English or Spanish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Stats Header */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">
            {filteredFlashcards.length === flashcards.length
              ? `All Words (${flashcards.length})`
              : `Results (${filteredFlashcards.length} of ${flashcards.length})`}
          </h2>
          <span className="flex gap-4 text-sm text-muted-foreground">
            <span className="text-success">Known: {knownCount}</span>
            <span className="text-destructive">Learning: {learningCount}</span>
          </span>
        </div>
      </div>

      {/* Word List by Difficulty */}
      <div className="flex-1 overflow-auto space-y-4">
        {(["easy", "medium", "hard"] as Difficulty[]).map((difficulty) => {
          const words = groupedFlashcards[difficulty];
          const config = difficultyConfig[difficulty];
          const isExpanded = expandedSections[difficulty];

          if (words.length === 0) return null;

          return (
            <div key={difficulty} className="rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => toggleSection(difficulty)}
                className={`w-full flex items-center justify-between p-4 ${config.bgColor} transition-colors hover:opacity-90`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-semibold ${config.color}`}>
                    {config.label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({words.length} words)
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <div className="p-2 space-y-2 bg-background">
                  {words.map(renderWordCard)}
                </div>
              )}
            </div>
          );
        })}

        {filteredFlashcards.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No words found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default WordList;
