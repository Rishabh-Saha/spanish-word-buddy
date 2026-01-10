export interface Flashcard {
  id: number;
  spanish: string;
  english: string;
  usage: string;
}

export const flashcards: Flashcard[] = [
  {
    id: 1,
    spanish: "Hola",
    english: "Hello",
    usage: "¡Hola! ¿Cómo estás? — Hello! How are you?",
  },
  {
    id: 2,
    spanish: "Gracias",
    english: "Thank you",
    usage: "Muchas gracias por tu ayuda. — Thank you very much for your help.",
  },
  {
    id: 3,
    spanish: "Por favor",
    english: "Please",
    usage: "¿Puedes ayudarme, por favor? — Can you help me, please?",
  },
  {
    id: 4,
    spanish: "Buenos días",
    english: "Good morning",
    usage: "Buenos días, ¿cómo amaneciste? — Good morning, how did you wake up?",
  },
  {
    id: 5,
    spanish: "Hasta luego",
    english: "See you later",
    usage: "Hasta luego, nos vemos mañana. — See you later, see you tomorrow.",
  },
  {
    id: 6,
    spanish: "Me encanta",
    english: "I love it",
    usage: "Me encanta la música española. — I love Spanish music.",
  },
  {
    id: 7,
    spanish: "No entiendo",
    english: "I don't understand",
    usage: "Lo siento, no entiendo. ¿Puedes repetir? — Sorry, I don't understand. Can you repeat?",
  },
  {
    id: 8,
    spanish: "¿Cuánto cuesta?",
    english: "How much does it cost?",
    usage: "¿Cuánto cuesta este libro? — How much does this book cost?",
  },
  {
    id: 9,
    spanish: "Tengo hambre",
    english: "I'm hungry",
    usage: "Tengo hambre, vamos a comer. — I'm hungry, let's eat.",
  },
  {
    id: 10,
    spanish: "¡Qué lindo!",
    english: "How beautiful!",
    usage: "¡Qué lindo es este lugar! — How beautiful this place is!",
  },
  {
    id: 11,
    spanish: "Mucho gusto",
    english: "Nice to meet you",
    usage: "Mucho gusto, soy María. — Nice to meet you, I'm María.",
  },
  {
    id: 12,
    spanish: "¿Dónde está?",
    english: "Where is it?",
    usage: "¿Dónde está el baño? — Where is the bathroom?",
  },
];
