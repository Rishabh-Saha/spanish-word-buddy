export interface Flashcard {
  row_number: number;
  spanish: string;
  english: string;
  usage: string;
  known?: boolean;
  learned?: number;
  difficulty?: "easy" | "medium" | "hard";
}
