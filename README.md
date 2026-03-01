# AMS-IONIC — ALS Mapping System (Ionic React)

A **React + Ionic** port of the [ALS-Mapping-System-AMS](https://github.com/JustJhong609/ALS-Mapping-System-AMS) React Native app. Built for the browser with the same ALS Form 1 data model and UI flow.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Ionic React 8 + Vite |
| Router | React Router v5 via `@ionic/react-router` |
| UI Kit | Ionic Components (`IonCard`, `IonInput`, `IonSelect`, …) |
| State | React `useState` + Context API |
| Language | TypeScript |

---

## Project Structure

```
src/
├── main.tsx                  # Entry point
├── App.tsx                   # Root – routing & global state
├── context/
│   └── AppContext.ts         # Global learner & user state
├── types/index.ts            # Learner, LearnerFormData, User
├── utils/
│   ├── constants.ts          # Region, division, picker options, colours
│   ├── helpers.ts            # createEmptyFormData, generateId, formatDate
│   └── validation.ts         # Per-section validators
├── components/
│   ├── StepIndicator.tsx     # 5-step wizard progress bar
│   ├── FormInput.tsx         # Reusable input field
│   ├── FormSelect.tsx        # Reusable IonSelect wrapper
│   ├── RadioGroup.tsx        # Radio-button group
│   └── form/
│       ├── PersonalInfoSection.tsx
│       ├── EducationSection.tsx
│       ├── AddressSection.tsx
│       ├── FamilySection.tsx
│       └── LogisticsSection.tsx
├── pages/
│   ├── LoginPage.tsx         # Sign-in / Sign-up
│   ├── HomePage.tsx          # Dashboard + quick stats
│   ├── LearnerListPage.tsx   # Searchable list + delete
│   ├── LearnerFormPage.tsx   # 5-step wizard (add / edit)
│   ├── LearnerDetailPage.tsx # Read-only detail view
│   └── AnalyticsPage.tsx     # Stats + bar charts
└── theme/
    ├── variables.css         # Ionic CSS variables (colours)
    └── global.css            # App-wide styles
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (opens on http://localhost:8100)
npm run dev

# 3. Build for production
npm run build
```

---

## Screens

| Screen | Route | Description |
|---|---|---|
| Login | `/login` | Sign-in / Create account |
| Home | `/home` | Welcome banner, quick stats, menu |
| Learner List | `/learners` | Search, card list, edit, delete, FAB |
| Learner Form | `/learners/new` or `/learners/edit/:id` | 5-step wizard |
| Learner Detail | `/learners/:id` | Read-only grouped cards |
| Analytics | `/analytics` | Stats overview + bar charts |

---

## Roadmap

- [ ] SQLite / Supabase persistence
- [ ] Offline-first sync
- [ ] Export to CSV / Excel
- [ ] Capacitor native build (Android / iOS)