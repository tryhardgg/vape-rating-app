# 📖 Справочник API (JavaScript функции)

**Проект:** Monster Vapor Tracker  
**Последнее обновление:** 2026-04-01

---

## 📁 Файлы с кодом

| Файл | Назначение | Строк |
|------|------------|-------|
| `js/app.js` | Основная логика | ~900 |
| `js/data.js` | Данные о вкусах | ~120 |
| `js/storage.js` | Хранение данных | ~150 |
| `js/supabase-config.js` | Supabase функции | ~140 |

---

## 🚀 Основные функции (app.js)

### Инициализация

#### `initApp()`

**Описание:** Инициализация приложения при загрузке страницы

**Вызов:** Автоматически при `DOMContentLoaded`

**Что делает:**
1. Загружает данные из localStorage
2. Синхронизирует с Supabase
3. Инициализирует UI элементы
4. Рендерит карточки

---

#### `initTabs()`

**Описание:** Инициализация переключения вкладок

**Обработчики:**
- Клик на `.tab-btn` → `switchTab(tabName)`

---

#### `initSearch()`

**Описание:** Инициализация поиска

**Обработчики:**
- `input` на `#searchInput` → фильтрация карточек
- `click` на `#clearSearchBtn` → очистка поиска

---

#### `initModal()`

**Описание:** Инициализация модального окна редактирования

**Обработчики:**
- Клик на `.card` → `openModal(cardId)`
- Клик на `#modalClose` → `closeModal()`
- Клик на `#saveBtn` → `saveCurrentCard()`
- Клик на `#deleteBtn` → `deleteCurrentCard()`

---

#### `initEmojiSelector()`

**Описание:** Инициализация выбора иконок

**Обработчики:**
- Клик на `.emoji` → `toggleEmoji(emoji)`

---

#### `initImageUpload()`

**Описание:** Инициализация загрузки изображений

**Обработчики:**
- `change` на `#cardImage` → превью изображения
- Клик на `#removeImageBtn` → удаление изображения

---

#### `initScrollToTop()`

**Описание:** Инициализация кнопки скролла вверх

**Обработчики:**
- `scroll` на `window` → показать/скрыть кнопку
- Клик на `#scrollToTopBtn` → скролл наверх

---

### Рендеринг

#### `renderCurrentTab()`

**Описание:** Рендерит карточки для текущей вкладки

**Вызов:**
- После инициализации
- После переключения вкладки
- После поиска
- После сохранения/удаления

---

#### `renderMVCards()`

**Описание:** Рендерит карточки Monster Vapor

**Логика:**
1. Фильтрует `card.isOther !== true`
2. Применяет поиск
3. Сортирует по рейтингу
4. Создаёт HTML элементы

---

#### `renderOtherCards()`

**Описание:** Рендерит карточки Экспериментов

**Логика:**
1. Фильтрует `card.isOther === true`
2. Применяет поиск
3. Сортирует по рейтингу
4. Создаёт HTML элементы

---

#### `createCardElement(card)`

**Параметры:**
- `card` {Object} — данные карточки

**Возвращает:** `HTMLElement` — DOM элемент карточки

**Что создаёт:**
- `.card-image` — изображение
- `.card-flavor` — название вкуса
- `.card-rating` — рейтинг (если есть)
- `.card-emojis` — иконки (если есть)
- `.tooltip` — примечание (если есть)

---

#### `getDisplayedEmojis(card)`

**Параметры:**
- `card` {Object} — данные карточки

**Возвращает:** `Array<{emoji: string, class: string}>`

**Логика:**
1. Объединяет иконки от обоих пользователей
2. Сортирует по приоритету (⚠️🌪🧼🍯💎)
3. Определяет класс (both/sasha/nastya)

---

### Модальное окно

#### `openModal(cardId)`

**Параметры:**
- `cardId` {string|number} — ID карточки

**Что делает:**
1. Загружает данные карточки
2. Заполняет поля формы
3. Показывает модальное окно

---

#### `closeModal()`

**Что делает:**
1. Скрывает модальное окно
2. Очищает временные данные

---

#### `saveCurrentCard()`

**Что делает:**
1. Проверяет на дубликаты названий
2. Собирает данные из формы
3. Сохраняет в localStorage
4. Сохраняет в Supabase
5. Перерисовывает карточки
6. Закрывает модальное окно

---

#### `deleteCurrentCard()`

**Что делает:**
1. Проверяет можно ли удалять
2. Удаляет из localStorage
3. Удаляет из Supabase
4. Перерисовывает карточки
5. Закрывает модальное окно

---

### Утилиты

#### `toggleEmoji(emoji)`

**Параметры:**
- `emoji` {string} — символ эмодзи

**Что делает:**
1. Добавляет/удаляет из `appState.tempEmojis`
2. Обновляет UI селектора
3. Обновляет превью

---

#### `updateEmojiSelector()`

**Описание:** Обновляет визуальное состояние селектора иконок

---

#### `updateSelectedEmojisPreview()`

**Описание:** Обновляет превью выбранных иконок

**Логика:**
1. Сортирует иконки по приоритету
2. Создаёт DOM элементы
3. Показывает в превью

---

#### `updateImagePreview()`

**Описание:** Обновляет превью загруженного изображения

---

#### `updateAverageRating()`

**Описание:** Обновляет отображение среднего рейтинга

**Формула:** `(ratingSasha + ratingNastya) / 2`

---

#### `showWarningModal(message)`

**Параметры:**
- `message` {string} — Текст предупреждения

**Что делает:**
1. Устанавливает текст
2. Показывает модальное окно
3. Навешивает обработчики закрытия

---

#### `sortEmojisByPriority(emojis)`

**Параметры:**
- `emojis` {Array<string>} — массив иконок

**Возвращает:** `Array<string>` — отсортированный массив

**Приоритет:**
1. ⚠️ (Жжёт испарики)
2. 🌪 (Сушит - душит)
3. 🧼 (Мыльный вкус)
4. 🍯 (Быстро надоедает)
5. 💎 (Редкий товар)

---

#### `filterCardsBySearch(cards)`

**Параметры:**
- `cards` {Array} — массив карточек

**Возвращает:** `Array` — отфильтрованные карточки

**Логика:**
- Поиск по `name`, `flavor`, `brand`
- Регистронезависимый

---

#### `sortCardsByRating(cards)`

**Параметры:**
- `cards` {Array} — массив карточек

**Возвращает:** `Array` — отсортированные карточки

**Сортировка:** По убыванию `averageRating`

---

#### `generateBottleSVG(name, color)`

**Параметры:**
- `name` {string} — название вкуса
- `color` {string} — цвет (#RRGGBB)

**Возвращает:** `string` — SVG строка

**Что генерирует:**
- Флакон с градиентом
- Этикетка "MONSTER VAPOR"
- Название вкуса
- Логотип "M"

---

#### `getFlavorEmoji(name)`

**Параметры:**
- `name` {string} — название вкуса

**Возвращает:** `string` — эмодзи

**Примеры:**
- "apple" → 🍎
- "grape" → 🍇
- "strawberry" → 🍓

---

#### `generateGradientFromString(str)`

**Параметры:**
- `str` {string} — строка для хэша

**Возвращает:** `string` — CSS градиент

**Использует:** 10预设 градиентов

---

### Добавление карточек

#### `addNewCard(type)`

**Параметры:**
- `type` {string} — 'mv' или 'other'

**Что делает:**
1. Создаёт новую карточку
2. Добавляет в `appState.cards`
3. Сохраняет в localStorage
4. Переключает на вкладку
5. Открывает модальное окно

---

#### `addMvCardBtn` / `addCardBtn`

**Обработчики клика:**
- `#addMvCardBtn` → `addNewCard('mv')`
- `#addCardBtn` → `addNewCard('other')`

---

### Сброс

#### `initResetButton()`

**Описание:** Инициализация кнопки сброса данных

**Обработчики:**
- Клик на `#resetBtn` → открытие модального окна
- Ввод в `#resetConfirmInput` → активация кнопки
- Клик на `#confirmResetBtn` → сброс данных

---

#### `resetAppData()`

**Что делает:**
1. Очищает localStorage
2. Инициализирует данными Monster Vapor
3. Сохраняет в localStorage
4. Перерисовывает карточки

---

## 💾 Функции хранения (storage.js)

### localStorage

#### `saveData(data)`

**Параметры:**
- `data` {Object} — данные для сохранения

**Возвращает:** `boolean` — успешно ли

**Что делает:**
- Сериализует в JSON
- Сохраняет в localStorage
- Обрабатывает `QuotaExceededError`

---

#### `loadData()`

**Возвращает:** `Object|null` — загруженные данные

**Что делает:**
- Читает из localStorage
- Десериализует JSON
- Обрабатывает ошибки

---

#### `clearAll()`

**Возвращает:** `boolean` — успешно ли

**Что делает:**
- Удаляет ключ из localStorage

---

### Карточки

#### `saveCard(id, cardData, allCards)`

**Параметры:**
- `id` {string|number} — ID карточки
- `cardData` {Object} — данные карточки
- `allCards` {Array} — все карточки

**Возвращает:** `Array` — обновлённый массив

**Асинхронно:** Сохраняет в Supabase

---

#### `getCard(id, allCards)`

**Параметры:**
- `id` {string|number} — ID карточки
- `allCards` {Array} — все карточки

**Возвращает:** `Object|null` — найденная карточка

---

#### `deleteCard(id, allCards)`

**Параметры:**
- `id` {string|number} — ID карточки
- `allCards` {Array} — все карточки

**Возвращает:** `Array` — обновлённый массив

**Асинхронно:** Удаляет из Supabase

---

#### `getOtherCards(allCards)`

**Параметры:**
- `allCards` {Array} — все карточки

**Возвращает:** `Array` — карточки Экспериментов

---

#### `getMVCards(allCards)`

**Параметры:**
- `allCards` {Array} — все карточки

**Возвращает:** `Array` — карточки Monster Vapor

---

## 🗄️ Функции Supabase (supabase-config.js)

### Инициализация

#### `createClient(url, key)`

**Вызов:** `window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)`

**Возвращает:** Supabase client object

---

### CRUD операции

#### `saveCardToSupabase(card)`

**Параметры:**
- `card` {Object} — данные карточки

**Возвращает:** `Promise<boolean>`

**SQL:**
```sql
INSERT INTO cards (...) VALUES (...)
ON CONFLICT (card_id) DO UPDATE
```

---

#### `loadCardsFromSupabase()`

**Возвращает:** `Promise<Array>`

**SQL:**
```sql
SELECT * FROM cards
```

**Преобразует:**
- `card_id` → `id`
- `rating_sasha` → `ratingSasha`
- `is_other` → `isOther`

---

#### `deleteCardFromSupabase(cardId)`

**Параметры:**
- `cardId` {string|number} — ID карточки

**Возвращает:** `Promise<boolean>`

**SQL:**
```sql
DELETE FROM cards WHERE card_id = ?
```

---

#### `syncWithSupabase(localCards)`

**Параметры:**
- `localCards` {Array} — локальные данные

**Возвращает:** `Promise<Array>`

**Логика:**
1. Загружает из Supabase
2. Если пусто → сохраняет локальные
3. Если есть данные → возвращает их

---

### Утилиты

#### `calculateAverageRating(ratingSasha, ratingNastya)`

**Параметры:**
- `ratingSasha` {number|null}
- `ratingNastya` {number|null}

**Возвращает:** `number|null` — средний рейтинг

**Формула:** `(ratingSasha + ratingNastya) / 2`

---

#### `createEmptyCard(baseData, isOther)`

**Параметры:**
- `baseData` {Object} — базовые данные
- `isOther` {boolean} — вкладка "Эксперименты"

**Возвращает:** `Object` — пустая карточка

**Структура:**
```javascript
{
    id: baseData.id || Date.now(),
    name: baseData.name || "",
    flavor: baseData.flavor || "",
    brand: baseData.brand || "Monster Vapor",
    color: baseData.color || null,
    image: baseData.image || null,
    ratingSasha: null,
    ratingNastya: null,
    averageRating: null,
    emojisSasha: [],
    emojisNastya: [],
    note: "",
    isFilled: false,
    isOther: isOther,
    isUserAdded: baseData.isUserAdded || false,
    createdAt: new Date().toISOString()
}
```

---

## 📊 Глобальные переменные (app.js)

### `appState`

**Тип:** `Object`

**Структура:**
```javascript
{
    cards: [],                    // Все карточки
    currentTab: 'mv',             // Текущая вкладка
    searchQuery: '',              // Поисковый запрос
    currentEditingCardId: null,   // ID редактируемой карточки
    tempEmojis: [],               // Временные иконки
    tempImage: null               // Временное изображение
}
```

---

### `monsterVaporFlavors`

**Тип:** `Array<Object>`

**Расположение:** `js/data.js`

**Структура:**
```javascript
{
    id: 1,
    name: "Barawolf",
    flavor: "Малина и барбарис",
    brand: "Monster Vapor",
    color: "#e94560",
    image: "images/monster-vapor/Barawolf.svg"
}
```

---

### `availableEmojis`

**Тип:** `Array<string>`

**Расположение:** `js/data.js`

**Значение:**
```javascript
["🍯", "⚠️", "🧼", "🌪", "💎"]
```

---

## 🎯 Точки входа

### Загрузка страницы

```javascript
document.addEventListener('DOMContentLoaded', initApp);
```

**Последовательность:**
1. `initApp()`
2. Загрузка данных
3. Синхронизация с Supabase
4. Инициализация UI
5. Рендеринг карточек

---

### Сохранение карточки

```
Клик на "Сохранить"
    ↓
saveCurrentCard()
    ↓
Проверка дубликатов
    ↓
MonsterVaporStorage.saveCard()
    ↓
saveCardToSupabase()
    ↓
renderCurrentTab()
    ↓
closeModal()
```

---

### Удаление карточки

```
Клик на "Удалить"
    ↓
deleteCurrentCard()
    ↓
MonsterVaporStorage.deleteCard()
    ↓
deleteCardFromSupabase()
    ↓
renderCurrentTab()
    ↓
closeModal()
```

---

## 📝 Примеры использования

### Получить все карточки

```javascript
const cards = appState.cards;
```

### Найти карточку по ID

```javascript
const card = MonsterVaporStorage.getCard(cardId, appState.cards);
```

### Сохранить изменения

```javascript
await MonsterVaporStorage.saveCard(cardId, cardData, appState.cards);
```

### Отфильтровать по поиску

```javascript
const filtered = filterCardsBySearch(appState.cards);
```

### Отсортировать по рейтингу

```javascript
const sorted = sortCardsByRating(filtered);
```

---

**Справочник актуален для версии 1.0.0**  
**Последнее обновление:** 2026-04-01
