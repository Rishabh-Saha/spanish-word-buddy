# 🇪🇸 Spanish Word Buddy

An interactive Spanish vocabulary learning application that helps you master Spanish words through flashcards and quizzes. Built with React, TypeScript, and modern UI components.

![Spanish Word Buddy](https://img.shields.io/badge/Learn-Spanish-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![Vite](https://img.shields.io/badge/Vite-5.4-646cff)

## ✨ Features

### 📚 Vocabulary Mode
- **Interactive Flashcards**: Flip cards to reveal translations and usage examples
- **Text-to-Speech**: Listen to Spanish pronunciation with audio playback
- **Progress Tracking**: Mark words as known/unknown to track your learning journey
- **Smart Filtering**: Focus on words you haven't mastered yet
- **Visual Progress Bar**: See your progress through the card deck

### 🎯 Test Mode
- **Multiple Choice Quizzes**: Test your knowledge with randomized questions
- **Instant Feedback**: Get immediate results after each answer
- **Score Tracking**: Monitor your performance throughout the quiz
- **Review System**: Complete results with correct answers shown
- **Restart Capability**: Practice as many times as you need

### 🎨 User Interface
- **Modern Design**: Clean, responsive UI built with shadcn/ui components
- **Dark Mode Support**: Comfortable learning in any lighting condition
- **Mobile Responsive**: Learn on any device, anywhere
- **Smooth Animations**: Engaging card flip animations and transitions
- **Accessible**: Keyboard navigation and screen reader support

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **bun** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd spanish-word-buddy
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:8080` to start learning!

## 📖 Usage

### Vocabulary Mode
1. Click on a flashcard to flip it and see the English translation
2. Use the speaker icon to hear the Spanish pronunciation
3. Click "I Know This" if you're confident with the word
4. Click "I Don't Know" to review it again later
5. Navigate through cards using the arrow buttons or keyboard shortcuts

### Test Mode
1. Switch to Test Mode from the header navigation
2. Read the Spanish word or phrase
3. Select the correct English translation from four options
4. Receive instant feedback on your answer
5. Complete all questions to see your final score
6. Review incorrect answers and restart the quiz

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript 5.5** - Type safety
- **Vite 5.4** - Build tool and dev server
- **React Router** - Navigation

### UI Components
- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### State Management
- **TanStack Query** - Server state management
- **React Hooks** - Local state management

### Features
- **Web Speech API** - Text-to-speech functionality
- **LocalStorage** - Progress persistence

## 📁 Project Structure

```
spanish-word-buddy/
├── src/
│   ├── components/          # React components
│   │   ├── FlashCard.tsx    # Main flashcard component
│   │   ├── VocabularyMode.tsx # Vocabulary learning interface
│   │   ├── TestMode.tsx     # Quiz interface
│   │   └── ui/              # shadcn/ui components
│   ├── data/
│   │   └── flashcards.ts    # Flashcard data types
│   ├── hooks/               # Custom React hooks
│   │   ├── useFlashcards.ts # Fetch flashcards
│   │   ├── useTextToSpeech.ts # Audio functionality
│   │   └── useUpdateCardStatus.ts # Progress tracking
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── pages/
│   │   ├── Index.tsx        # Main page
│   │   └── NotFound.tsx     # 404 page
│   ├── App.tsx              # App root
│   └── main.tsx             # Entry point
├── public/                  # Static assets
└── package.json             # Dependencies
```

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🌐 Deployment

### Deploy to Netlify, Vercel, or other platforms

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting platform

### Using Lovable
Simply open [Lovable](https://lovable.dev/projects/9488b1bf-a0fb-488e-bc84-b27f62e5edbb) and click on Share → Publish.

## 🎯 Roadmap

- [ ] Add more Spanish vocabulary categories
- [ ] Implement spaced repetition algorithm
- [ ] Add user authentication and cloud sync
- [ ] Create custom deck creation feature
- [ ] Add conjugation practice mode
- [ ] Implement difficulty levels
- [ ] Add achievement system
- [ ] Export/import progress data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

---

**Happy Learning! ¡Buena suerte! 🎉**
