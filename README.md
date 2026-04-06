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

- [x] SQLite / Supabase persistence
- [x] Offline-first sync
- [ ] Export to CSV / Excel
- [ ] Capacitor native build (Android / iOS)

---

## Build APK (Android Debug)

1. Install dependencies:

```bash
npm install
```

2. Add Android project once:

```bash
npm run android:add
```

3. Build web assets and sync native project:

```bash
npm run android:sync
```

4. Build debug APK:

```bash
npm run android:apk
```

Codespaces shortcut (auto-picks JDK 17/21):

```bash
npm run android:apk:codespaces
```

5. APK output path:

```bash
android/app/build/outputs/apk/debug/app-debug.apk
```

### Troubleshooting (Codespaces)

If you see this Gradle error:

```text
Unsupported class file major version 69
```

your active Java is too new for the current Android Gradle setup. Use:

```bash
npm run android:apk:codespaces
```

If you prefer manual setup, choose JDK 17 and retry:

```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
npm run android:apk
```

If the helper command only prints the script and stops, check installed JDK paths:

```bash
ls -la /usr/lib/jvm
java -version
```

Then set a valid JAVA_HOME from that list and retry:

```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
npm run android:apk
```

If you hit this Gradle error:

```text
SDK location not found. Define a valid SDK location with an ANDROID_HOME environment variable or by setting the sdk.dir path in android/local.properties
```

run the SDK setup helper, then build again:

```bash
npm run android:sdk:setup
npm run android:apk:codespaces
```

If SDK is still not detected, set it manually and retry:

```bash
export ANDROID_SDK_ROOT=/usr/local/lib/android/sdk
export ANDROID_HOME=$ANDROID_SDK_ROOT
npm run android:sdk:setup
npm run android:apk:codespaces
```