import { useState } from "react";
import { BookOpen, GraduationCap } from "lucide-react";
import VocabularyMode from "@/components/VocabularyMode";
import TestMode from "@/components/TestMode";

type Mode = "vocabulary" | "test";

const Index = () => {
  const [activeMode, setActiveMode] = useState<Mode>("vocabulary");

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
        {activeMode === "vocabulary" ? <VocabularyMode /> : <TestMode />}
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
