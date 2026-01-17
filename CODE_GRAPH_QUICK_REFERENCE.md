# Code Graph - Quick Reference

## 🎯 Quick Component Lookup

### Entry → Pages → Modes → Components

```
main.tsx
  └─ App.tsx (providers: Query, Router, Toast, Tooltip)
      └─ BrowserRouter
          ├─ Index.tsx (Main Page)
          │   ├─ useFlashcards() → API
          │   ├─ VocabularyMode
          │   │   ├─ FlashCard + useTextToSpeech
          │   │   └─ useUpdateCardStatus → API
          │   ├─ TestMode
          │   │   ├─ TypingTest + useUpdateLearnedStatus → API
          │   │   ├─ ClozeTest + useUpdateLearnedStatus → API
          │   │   └─ MultipleChoiceTest + useUpdateLearnedStatus → API
          │   └─ WordList + useTextToSpeech
          └─ NotFound.tsx (404)
```

## 📁 File Map (Core Files)

| File | Purpose | Dependencies |
|------|---------|-------------|
| `src/main.tsx` | Entry point | App.tsx |
| `src/App.tsx` | Root + providers | React Router, TanStack Query |
| `src/pages/Index.tsx` | Main page & mode router | useFlashcards, 3 mode components |
| `src/components/VocabularyMode.tsx` | Flashcard study | FlashCard, useUpdateCardStatus |
| `src/components/TestMode.tsx` | Test selector | 3 test components |
| `src/components/WordList.tsx` | Word browser | useTextToSpeech |
| `src/components/FlashCard.tsx` | Reusable card | useTextToSpeech |
| `src/components/TypingTest.tsx` | EN→ES typing | useUpdateLearnedStatus |
| `src/components/ClozeTest.tsx` | Fill-in-blank | useUpdateLearnedStatus |
| `src/components/MultipleChoiceTest.tsx` | MCQ test | useUpdateLearnedStatus |
| `src/hooks/useFlashcards.ts` | Fetch data | TanStack Query, API |
| `src/hooks/useUpdateCardStatus.ts` | Update known status | TanStack Query, API |
| `src/hooks/useTextToSpeech.ts` | Audio playback | Web Speech API |
| `src/data/flashcards.ts` | Type definitions | - |

## 🔄 Data Flow (Simplified)

```
API (n8n webhooks)
  ↓ GET
useFlashcards → TanStack Query (cache: 15min)
  ↓ flashcards[]
Index.tsx
  ↓ props
VocabularyMode / TestMode / WordList
  ↓ user interaction
useUpdateCardStatus / useUpdateLearnedStatus
  ↓ POST (batch every 10 cards)
API (n8n webhooks)
```

## 🎨 Key Algorithms

### Review Priority (VocabularyMode)
```typescript
priority = 100*(known==false) + 2*(30-learned) + 3*difficulty - 20*(learned>=10)
// Higher score = shown first
```

### Batch Updates
- Collects changes in local state (Set)
- Sends to API after every 10 card reviews
- Reduces network calls by 90%

## 🔌 API Endpoints

| Hook | Endpoint | Method | Payload | Purpose |
|------|----------|--------|---------|---------|
| useFlashcards | `VITE_SPANISH_FLASHCARDS_GET_URL` | GET | - | Fetch all cards |
| useUpdateCardStatus | `VITE_SPANISH_FLASHCARDS_UPDATE_URL` | POST | `{row_number, known}[]` | Update known status |
| useUpdateLearnedStatus | `VITE_SPANISH_FLASHCARDS_LEARNED_UPDATE_URL` | POST | `{row_number, learned}[]` | Update learned count |

All use **Basic Auth** with credentials from env vars.

## 🧩 Data Model

```typescript
Flashcard {
  row_number: number          // PK
  spanish: string             // Word
  english: string             // Translation
  usage: string               // Example
  known?: boolean             // User progress
  learned?: number            // Review count
  difficulty?: "easy"|"medium"|"hard"
  difficulty_score?: number
  group?: string              // For MCQ
}
```

## 🎯 Component Props Flow

```typescript
// Index → Modes
<VocabularyMode flashcards={Flashcard[]} />
<TestMode flashcards={Flashcard[]} />
<WordList flashcards={Flashcard[]} />

// VocabularyMode → FlashCard
<FlashCard 
  card={Flashcard}
  showActions={boolean}
  onKnown={() => void}
  onUnknown={() => void}
/>

// TestMode → Tests
<TypingTest flashcards={Flashcard[]} onBack={() => void} />
<ClozeTest flashcards={Flashcard[]} onBack={() => void} />
<MultipleChoiceTest flashcards={Flashcard[]} onBack={() => void} />
```

## 🚦 State Management

| State Type | Location | Tool | Purpose |
|------------|----------|------|---------|
| Server State | useFlashcards | TanStack Query | Cached API data |
| UI State | Component `useState` | React | Current mode, index, flip |
| Form State | Component `useState` | React | Test inputs, scores |
| Tracking State | Component `useState` (Set) | React | Known/unknown cards |

**No global state library needed** - data flows via props, queries shared via TanStack Query.

## 🎨 UI Libraries

- **Shadcn/UI**: 40+ pre-built components (`src/components/ui/`)
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Custom Animations**: Flip cards, transitions

## 📱 User Flows

### Vocabulary Study
1. User opens app → Index loads → VocabularyMode shown
2. FlashCard shows Spanish word
3. User taps → card flips → English + usage shown
4. User clicks "I Know This" or "Still Learning"
5. Card marked in local state → next card shown
6. After 10 cards → batch update sent to API

### Taking a Test
1. User clicks "Test" tab → TestMode shown
2. User selects test type (Typing/Cloze/MCQ)
3. Test component loads with flashcards
4. User completes questions
5. Score calculated → learned count updated via API
6. User clicks "Back" → returns to test selection

### Browsing Words
1. User clicks "Words" tab → WordList shown
2. Words grouped by difficulty (collapsible sections)
3. User types in search → filtered by Spanish or English
4. User clicks speaker icon → Spanish pronunciation plays
5. Cards color-coded: green border (known), red border (learning)

## 🔧 Developer Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with API credentials

# Run dev server
npm run dev

# Build for production
npm run build
```

## 📊 Component Size Estimate

| Component | Lines | Complexity |
|-----------|-------|------------|
| VocabularyMode | ~200 | Medium (priority algorithm, batch updates) |
| TestMode | ~100 | Low (just routing) |
| WordList | ~180 | Medium (search, grouping, collapsible) |
| FlashCard | ~120 | Low (simple flip animation) |
| TypingTest | ~150 | Medium (validation, scoring) |
| ClozeTest | ~150 | Medium (word extraction, validation) |
| MultipleChoiceTest | ~180 | Medium (option generation) |
| Index | ~120 | Low (mode switching) |

## 🐛 Common Debug Points

1. **No flashcards loading**: Check .env credentials and API URL
2. **Updates not saving**: Check batch counter (must review 10 cards)
3. **No audio**: Browser needs Spanish voice installed
4. **Styling broken**: Check Tailwind config and PostCSS
5. **Type errors**: Ensure Flashcard interface matches API response

## 🎓 Learning Path for New Developers

1. Start with `main.tsx` → `App.tsx` → `Index.tsx`
2. Understand data flow: `useFlashcards` hook
3. Explore one mode: `VocabularyMode.tsx` (simplest)
4. Check reusable component: `FlashCard.tsx`
5. Study custom hooks: `useTextToSpeech.ts` (simple), then update hooks
6. Explore test components if needed
7. Review UI components in `src/components/ui/` (pre-built)

---

For detailed architecture, see [CODE_GRAPH.md](./CODE_GRAPH.md)
