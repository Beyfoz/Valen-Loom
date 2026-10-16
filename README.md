# Vaelen Loom — Infinite Adventure Engine

Интерактивная нарративная RPG-новелла («бесконечный нарративный движок»), объединяющая классический текстовый квест, визуальную новеллу и настольную ролевую игру.

## Технологический стек
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4
- **State Management**: Zustand (с персистентным хранилищем в `localStorage`)
- **Visuals**: 100% фоновые иллюстрации с виньетированием, процедурный Canvas-генератор атмосферы для офлайна
- **AI Core**: Google Gemini API (`gemini-3.1-pro-preview`, `gemini-3.5-flash`, `gemini-3.1-flash-lite`, `gemini-3.8-flash`)
- **PWA**: Web App Manifest (`manifest.json`) + Service Worker (`sw.js`)

---

## 3 мира мультивселенной

1. **«Затопленная цитадель Велена»**
   - *Жанр*: Готическое глубинное тёмное фэнтези.
   - *Герои*: Кейлен Вэнс (Рыцарь Отлива), Сера Никс (Адептка Соляного Архива).
   - *Цель*: Найти Астролябию Короля Приливов.
   - *Стиль*: Кьяроскуро: чернила и масло гримуара.
   - *Ключевой босс*: Полый Страж (3+ исхода: бой, приливный фонарь/камертон, жертва памяти).

2. **«Медный заговор Новой Весперы»**
   - *Жанр*: Стимпанк / викторианский часовой нуар-детектив.
   - *Герои*: Инспектор Джулиан Стерлинг, Вивьен Кроу (инженер подполья).
   - *Цель*: Расследовать убийство часовщика Бартоломью Вейна и найти Маятниковое Ядро.
   - *Стиль*: Гуашь и тушь газового света.
   - *Ключевой босс*: Автоматон-Инквизитор "Секундант".

3. **«Странствие звёздных островов»**
   - *Жанр*: Мифическая астральная одиссея.
   - *Герои*: Капитан Лира Солис (корвет «Алкион»), Орион Скиталец (звёздный навигатор).
   - *Цель*: Провести корвет сквозь Эфирный Риф и зажечь Маяк Первородных Звёзд.
   - *Стиль*: Иллюминированный небесный миф.
   - *Ключевой босс*: Астральный Левиафан (Звёздный Дракон-Скиталец).

---

## Запуск проекта

### Локальная разработка:
```bash
# Установка зависимостей
npm install

# Запуск сервера разработки с Express и Vite
npm run dev
```
Сервер запустится на `http://localhost:3000`.

### Сборка production:
```bash
npm run build
npm start
```

---

## Добавление нового мира

Каждый мир хранится как независимый модуль в `/src/worlds/`:
1. Создайте файл `/src/worlds/my_world.ts`, реализующий интерфейс `WorldModule` из `/src/types.ts`.
2. Задайте:
   - `theme`: цвета, акценты, шрифты.
   - `protagonist` и `initialCompanion`: характеристики и визуальные дескрипторы для ИИ-арта.
   - `initialStats`: здоровье и рассудок (100/100).
   - `initialInventory`: реликвии, оружие, расходники с действиями `useAction`.
   - `initialQuests`: главное задание и подзадачи.
   - `scenes`: граф сцен (минимум 25-30 узлов) с проверками условий (`hasItem`, `minHealth`, `minSanity`, `flags`) и эффектами (`healthDelta`, `sanityDelta`, `itemsAdded`, `questUpdate`).
3. Зарегистрируйте мир в `/src/worlds/index.ts`:
```typescript
import { myWorld } from './my_world';
export const WORLDS = {
  vaelen: vaelenWorld,
  vespera: vesperaWorld,
  astral: astralWorld,
  myWorld: myWorld,
};
```

---

## Сборка мобильного приложения (Android APK через Capacitor)

Приложение полностью адаптировано под мобильные устройства и Capacitor:

1. Установите зависимости Capacitor:
```bash
npm install @capacitor/core
npm install -D @capacitor/cli @capacitor/android
```

2. Инициализируйте проект:
```bash
npx cap init "Vaelen Loom" "com.vaelenloom.rpg" --web-dir dist
```

3. Соберите проект Vite:
```bash
npm run build
```

4. Добавьте платформу Android:
```bash
npx cap add android
```

5. Синхронизируйте веб-сборку с нативным проектом:
```bash
npx cap sync
```

6. Откройте проект в Android Studio и соберите APK:
```bash
npx cap open android
```
В Android Studio: **Build > Build Bundle(s) / APK(s) > Build APK(s)**. Готовый `.apk` файл появится в папке `android/app/build/outputs/apk/debug/app-debug.apk`.
