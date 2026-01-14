import { useState } from "react";
import { BookOpen, GraduationCap, Loader2, AlertCircle, RotateCcw, List } from "lucide-react";
import VocabularyMode from "@/components/VocabularyMode";
import TestMode from "@/components/TestMode";
import WordList from "@/components/WordList";
import { useFlashcards } from "@/hooks/useFlashcards";

type Mode = "vocabulary" | "test" | "words";

const Index = () => {
  const [activeMode, setActiveMode] = useState<Mode>("vocabulary");
  const { data: flashcards, isLoading, error, refetch } = useFlashcards();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (error || !flashcards) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Failed to load flashcards</h2>
          <p className="text-muted-foreground mb-6">
            {error instanceof Error ? error.message : "Unable to connect to the server"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 active:scale-95 flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeMode) {
      case "vocabulary":
        return <VocabularyMode flashcards={flashcards} />;
      case "test":
        return <TestMode flashcards={flashcards} />;
      case "words":
        return <WordList flashcards={flashcards} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-gradient">
                ¡Aprende!
              </h1>
              <p className="text-sm text-muted-foreground">
                Spanish Flashcards
              </p>
            </div>
            
            {/* Mode Tabs */}
            <div className="flex gap-1 p-1 bg-secondary rounded-xl">
              <button
                onClick={() => setActiveMode("vocabulary")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeMode === "vocabulary"
                    ? "bg-card text-foreground card-shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Vocabulary</span>
              </button>
              <button
                onClick={() => setActiveMode("words")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeMode === "words"
                    ? "bg-card text-foreground card-shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Words</span>
              </button>
              <button
                onClick={() => setActiveMode("test")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeMode === "test"
                    ? "bg-card text-foreground card-shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">Test</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-3xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>
    </div>
  );
};

export default Index;
