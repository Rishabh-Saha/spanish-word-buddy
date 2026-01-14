export interface Flashcard {
  row_number: number;
  spanish: string;
  english: string;
  usage: string;
  known?: boolean;
  learned?: boolean;
  difficulty?: "easy" | "medium" | "hard";
}
