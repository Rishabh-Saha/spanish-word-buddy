import { useState } from "react";
import { Keyboard, Type, ListChecks } from "lucide-react";
import { Flashcard } from "@/data/flashcards";
import TypingTest from "./TypingTest";
import ClozeTest from "./ClozeTest";
import MultipleChoiceTest from "./MultipleChoiceTest";

interface TestModeProps {
  flashcards: Flashcard[];
}

type TestType = "typing" | "cloze" | "multiple-choice";

const TestMode = ({ flashcards }: TestModeProps) => {
  const [testType, setTestType] = useState<TestType | null>(null);

  const goToTestSelection = () => {
    setTestType(null);
  };

  // Render selected test component
  if (testType === "typing") {
    return <TypingTest flashcards={flashcards} onBack={goToTestSelection} />;
  }

  if (testType === "cloze") {
    return <ClozeTest flashcards={flashcards} onBack={goToTestSelection} />;
  }

  if (testType === "multiple-choice") {
    return <MultipleChoiceTest flashcards={flashcards} onBack={goToTestSelection} />;
  }

  // Test type selection screen
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-semibold text-foreground mb-2">
            Choose Test Mode
          </h2>
          <p className="text-muted-foreground">
            Select how you want to practice
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setTestType("typing")}
            className="w-full p-6 rounded-2xl bg-card border border-border card-shadow text-left transition-all hover:border-primary/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Keyboard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">EN → ES Typing</h3>
                <p className="text-sm text-muted-foreground">
                  See English, type the Spanish translation
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setTestType("cloze")}
            className="w-full p-6 rounded-2xl bg-card border border-border card-shadow text-left transition-all hover:border-primary/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Type className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Cloze Deletion</h3>
                <p className="text-sm text-muted-foreground">
                  Fill in the missing word in the sentence
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setTestType("multiple-choice")}
            className="w-full p-6 rounded-2xl bg-card border border-border card-shadow text-left transition-all hover:border-primary/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                <ListChecks className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Multiple Choice (by Group)</h3>
                <p className="text-sm text-muted-foreground">
                  Pick the right answer from similar difficulty words
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestMode;
