import { useState, useMemo, useEffect } from "react";
import { Check, X, RotateCcw, Trophy } from "lucide-react";
import { Flashcard } from "@/data/flashcards";
import { useUpdateLearnedStatus } from "@/hooks/useUpdateCardStatus";

interface TestModeProps {
  flashcards: Flashcard[];
}

const TestMode = ({ flashcards }: TestModeProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [correctlyAnsweredCards, setCorrectlyAnsweredCards] = useState<
    Set<number>
  >(new Set());
  const { mutate: updateCardStatus } = useUpdateLearnedStatus();

  // Shuffle cards and create quiz
  const shuffledCards = useMemo(() => {
    return [...flashcards].sort(() => Math.random() - 0.5);
  }, []);

  const currentQuestion = shuffledCards[currentQuestionIndex];

  // Generate answer options
  const options = useMemo(() => {
    const correctAnswer = currentQuestion.english;
    const wrongAnswers = flashcards
      .filter((card) => card.row_number !== currentQuestion.row_number)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((card) => card.english);

    return [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5);
  }, [currentQuestion]);

  useEffect(() => {
    if (currentQuestionIndex % 10 === 0 && currentQuestionIndex !== 0) {
      // every 10 questions
      // update database for correctly answered cards only

      const updates = Array.from(correctlyAnsweredCards).map((row_number) => ({
        row_number,
        learned:
          (shuffledCards.find((card) => card.row_number === row_number)
            ?.learned || 0) + 1,
      }));
      console.log(
        "Updating learned status for cards:",
        updates,
        correctlyAnsweredCards
      );
      if (updates.length > 0) {
        updateCardStatus(updates);
      }
    }
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === currentQuestion.english) {
      setScore((prev) => prev + 1);
      // Track correctly answered cards
      setCorrectlyAnsweredCards((prev) =>
        new Set(prev).add(currentQuestion.row_number)
      );
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledCards.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsComplete(true);
    }
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsComplete(false);
    setCorrectlyAnsweredCards(new Set());
  };

  const progress = ((currentQuestionIndex + 1) / shuffledCards.length) * 100;
  const finalPercentage = Math.round((score / shuffledCards.length) * 100);

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

          <button
            onClick={resetTest}
            className="w-full px-6 py-4 rounded-xl bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 active:scale-98 button-shadow flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Take Test Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>
            Question {currentQuestionIndex + 1} of {shuffledCards.length}
          </span>
          <span className="text-success font-medium">Score: {score}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-lg">
          <div className="bg-card rounded-2xl card-shadow p-8 text-center border border-border mb-6">
            <span className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block">
              What does this mean?
            </span>
            <h2 className="font-display text-4xl font-semibold text-foreground">
              {currentQuestion.spanish}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="grid gap-3">
            {options.map((option, index) => {
              const isCorrect = option === currentQuestion.english;
              const isSelected = option === selectedAnswer;

              let buttonClass =
                "w-full p-4 rounded-xl text-left font-medium transition-all border ";

              if (showResult) {
                if (isCorrect) {
                  buttonClass += "bg-success/10 border-success text-success";
                } else if (isSelected && !isCorrect) {
                  buttonClass +=
                    "bg-destructive/10 border-destructive text-destructive";
                } else {
                  buttonClass +=
                    "bg-secondary border-transparent text-muted-foreground opacity-50";
                }
              } else {
                buttonClass +=
                  "bg-secondary border-transparent text-secondary-foreground hover:bg-secondary/80 hover:border-primary/20 active:scale-98";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && isCorrect && (
                      <Check className="w-5 h-5 text-success" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <X className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Usage hint after answering */}
          {showResult && (
            <div className="mt-6 p-4 bg-muted rounded-xl animate-slide-in">
              <p className="text-sm text-muted-foreground italic text-center">
                {currentQuestion.usage}
              </p>
            </div>
          )}

          {/* Next button */}
          {showResult && (
            <button
              onClick={handleNext}
              className="w-full mt-6 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 active:scale-98 button-shadow"
            >
              {currentQuestionIndex < shuffledCards.length - 1
                ? "Next Question"
                : "See Results"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestMode;
