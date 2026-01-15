import { useState, useMemo, useCallback } from "react";
import { RotateCcw, Trophy } from "lucide-react";
import { Flashcard } from "@/data/flashcards";

interface ClozeTestProps {
  flashcards: Flashcard[];
  onBack: () => void;
}

const ClozeTest = ({ flashcards, onBack }: ClozeTestProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Shuffle cards for the test
  const shuffledCards = useMemo(() => {
    return [...flashcards].sort(() => Math.random() - 0.5);
  }, [flashcards]);

  const currentQuestion = shuffledCards[currentQuestionIndex];

  // Generate cloze text by replacing the Spanish word in usage
  const clozeData = useMemo(() => {
    if (!currentQuestion) return { text: "", answer: "" };
    const usage = currentQuestion.usage;
    const word = currentQuestion.spanish;
    
    // Try to find the word in usage (case insensitive)
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const match = usage.match(regex);
    
    if (match) {
      const clozeText = usage.replace(regex, "______");
      return { text: clozeText, answer: match[0] };
    }
    
    // Fallback: just show the usage and ask for the word
    return { text: usage, answer: word };
  }, [currentQuestion]);

  const normalizeAnswer = (str: string) => {
    return str.toLowerCase().trim().replace(/[¿¡!?.,]/g, "");
  };

  const checkClozeAnswer = useCallback(() => {
    if (showResult) return;
    
    const isCorrect = normalizeAnswer(typedAnswer) === normalizeAnswer(clozeData.answer);
    setShowResult(true);
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  }, [typedAnswer, clozeData.answer, showResult]);

  const handleNext = () => {
    if (currentQuestionIndex < shuffledCards.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTypedAnswer("");
      setShowResult(false);
    } else {
      setIsComplete(true);
    }
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setTypedAnswer("");
    setShowResult(false);
    setIsComplete(false);
  };

  const progress = shuffledCards.length > 0 ? ((currentQuestionIndex + 1) / shuffledCards.length) * 100 : 0;
  const finalPercentage = shuffledCards.length > 0 ? Math.round((score / shuffledCards.length) * 100) : 0;

  // Completion screen
  if (isComplete) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="bg-card rounded-2xl card-shadow p-10 text-center max-w-md border border-border">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-accent" />
          </div>
          <h2 className="font-display text-3xl font-semibold text-foreground mb-2">
            ¡Excelente!
          </h2>
          <p className="text-muted-foreground mb-6">
            You've completed the test
          </p>
          
          <div className="bg-secondary rounded-xl p-6 mb-6">
            <div className="text-5xl font-display font-bold text-gradient mb-2">
              {finalPercentage}%
            </div>
            <p className="text-secondary-foreground">
              {score} out of {shuffledCards.length} correct
            </p>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            {finalPercentage >= 80 
              ? "Amazing work! You're mastering Spanish!" 
              : finalPercentage >= 50 
                ? "Good effort! Keep practicing to improve."
                : "Keep learning! Practice makes perfect."}
          </p>

          <div className="space-y-3">
            <button
              onClick={resetTest}
              className="w-full px-6 py-4 rounded-xl bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 active:scale-98 button-shadow flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Take Test Again
            </button>
            <button
              onClick={onBack}
              className="w-full px-6 py-4 rounded-xl bg-secondary text-secondary-foreground font-medium transition-all hover:bg-secondary/80 active:scale-98"
            >
              Try Different Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCorrect = normalizeAnswer(typedAnswer) === normalizeAnswer(clozeData.answer);

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-primary hover:underline"
            >
              ← Change Mode
            </button>
            <span className="text-border">|</span>
            <span>Question {currentQuestionIndex + 1} of {shuffledCards.length}</span>
          </div>
          <span className="text-success font-medium">Score: {score}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-lg">
          <div className="bg-card rounded-2xl card-shadow p-8 text-center border border-border mb-6">
            <span className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block">
              Fill in the blank
            </span>
            <h2 className="font-display text-2xl font-semibold text-foreground leading-relaxed">
              {clozeData.text}
            </h2>
            <p className="text-sm text-muted-foreground mt-4">
              ({currentQuestion.english})
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !showResult && typedAnswer.trim()) {
                  checkClozeAnswer();
                } else if (e.key === "Enter" && showResult) {
                  handleNext();
                }
              }}
              placeholder="Type the missing word..."
              disabled={showResult}
              className={`w-full p-4 rounded-xl text-center text-xl font-medium bg-secondary border-2 transition-all outline-none ${
                showResult
                  ? isCorrect
                    ? "border-success bg-success/10 text-success"
                    : "border-destructive bg-destructive/10 text-destructive"
                  : "border-transparent focus:border-primary"
              }`}
              autoFocus
            />

            {showResult && !isCorrect && (
              <div className="p-4 bg-success/10 rounded-xl border border-success/30 text-center">
                <span className="text-sm text-muted-foreground">Correct answer: </span>
                <span className="font-semibold text-success">{clozeData.answer}</span>
              </div>
            )}

            {!showResult ? (
              <button
                onClick={checkClozeAnswer}
                disabled={!typedAnswer.trim()}
                className="w-full px-6 py-4 rounded-xl bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 active:scale-98 button-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full px-6 py-4 rounded-xl bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 active:scale-98 button-shadow"
              >
                {currentQuestionIndex < shuffledCards.length - 1 ? "Next Question" : "See Results"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClozeTest;
