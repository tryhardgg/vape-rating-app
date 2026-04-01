# 📚 Документация Monster Vapor Tracker

**Версия:** 1.0.0  
**Последнее обновление:** 2026-04-01  
**Статус:** ✅ Готов к использованию

---

## 📖 Оглавление

1. [О проекте](#о-проекте)
2. [Технологический стек](#технологический-стек)
3. [Структура проекта](#структура-проекта)
4. [База данных (Supabase)](#база-данных-supabase)
5. [Функционал](#функционал)
6. [Стили и дизайн](#стили-и-дизуайн)
7. [Разработка](#разработка)
8. [Публикация](#публикация)
9. [Планы на будущее](#планы-на-будущее)

---

## ℹ️ О проекте

**Monster Vapor Tracker** — веб-приложение для совместной оценки жидкостей для вейпа Monster Vapor.

**Целевая аудитория:** 2 пользователя (Саша и Настя)

**Основная идея:** 
- Каталог из 34+ вкусов Monster Vapor 20mg
- Рейтинги от Саши и Насти (0-10)
- Иконки-индикаторы особенностей вкуса
- Синхронизация между устройствами через Supabase
- Возможность добавлять свои жидкости ("Эксперименты")

**Ссылка на сайт:** https://tryhardgg.github.io/vape-rating-app/

---

## 🛠️ Технологический стек

| Категория | Технология | Версия |
|-----------|------------|--------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | ES6+ |
| **База данных** | Supabase (PostgreSQL) | 2.x |
| **Хостинг** | GitHub Pages | - |
| **Шрифты** | Galaktika (кастомный), Inter | - |
| **Иконки** | Emoji (Unicode), SVG | - |

**Зависимости:**
- `@supabase/supabase-js@2` (CDN)
- Google Fonts (Galaktika, Inter)

---

## 📁 Структура проекта

```
vape-rating-app/
├── .git/                          # Git репозиторий
├── css/
│   └── styles.css                 # Все стили приложения
├── js/
│   ├── app.js                     # Основная логика приложения
│   ├── data.js                    # Данные о вкусах Monster Vapor
│   ├── storage.js                 # Работа с localStorage
│   └── supabase-config.js         # Подключение к Supabase
├── icon/                          # Фавиконки
│   ├── favicon.ico                # Основная иконка
│   ├── favicon-16x16.png          # 16x16 пикселей
│   ├── favicon-32x32.png          # 32x32 пикселей
│   ├── android-chrome-192x192.png # 192x192 пикселей
│   ├── android-chrome-512x512.png # 512x512 пикселей
│   ├── apple-touch-icon.png       # Для iOS
│   └── site.webmanifest           # PWA манифест
├── images/
│   └── monster-vapor/             # SVG флаконы для карточек
├── Шрифт/
│   └── TTF/
│       └── Galaktika.ttf          # Кастомный шрифт
├── background2.jpg                # Фон сайта
├── image1.png                     # Фон для рейтинга
├── index.html                     # Главная страница
├── README.md                      # Краткая инструкция
├── FUTURE_PLANS.md                # Планы на будущее
└── PROJECT_DOCS/                  # Документация
    ├── README.md                  # Этот файл
    ├── SYSTEM_PROMPT.md           # Системный промпт для ИИ
    ├── DATABASE_SCHEMA.md         # Схема базы данных
    └── API_REFERENCE.md           # API справочник
```

---

## 🗄️ База данных (Supabase)

### Подключение

**Проект:** https://supabase.com/dashboard/project/ajihwuotwwogahsgqdnv

**Файл:** `js/supabase-config.js`

```javascript
const SUPABASE_URL = 'https://ajihwuotwwogahsgqdnv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_...'; // Публичный ключ
```

### Таблица `cards`

| Поле | Тип | Описание | Значение по умолчанию |
|------|-----|----------|----------------------|
| `id` | int8 | Первичный ключ (автоинкремент) | auto |
| `card_id` | text | Уникальный ID карточки | - |
| `flavor` | text | Название вкуса | null |
| `note` | text | Примечание | null |
| `image` | text | Изображение (base64 или URL) | null |
| `rating_sasha` | float8 | Рейтинг Саши (0-10) | null |
| `rating_nastya` | float8 | Рейтинг Насти (0-10) | null |
| `emojis` | jsonb | Выбранные иконки (массив) | [] |
| `is_filled` | bool | Заполнена ли карточка | false |
| `is_other` | bool | Вкладка "Эксперименты" | false |
| `created_at` | timestamptz | Дата создания | now() |
| `updated_at` | timestamptz | Дата обновления | now() |

### RLS Policy

```sql
-- Разрешить все операции всем
CREATE POLICY "Доступ всем" ON cards
FOR ALL USING (true) WITH CHECK (true);
```

---

## ✨ Функционал

### Вкладки

| Вкладка | Описание |
|---------|----------|
| **Monster Vapor** | 34 карточки Monster Vapor (можно добавлять свои) |
| **Эксперименты** | Пользовательские жидкости (можно удалять) |

### Карточка жидкости

**Элементы:**
- Изображение флакона (SVG или загруженное PNG)
- Название вкуса (шрифт Galaktika, 30px)
- Рейтинг (среднее арифметическое Саша + Настя)
- Иконки-индикаторы (⚠️🌪🧼🍯💎)
- Tooltip с примечанием (при наведении)

**Редактирование:**
- Клик на карточку → модальное окно
- Поля: вкус, изображение, рейтинги, иконки, примечание
- Сохранение в Supabase + localStorage

### Иконки-индикаторы

| Иконка | Приоритет | Описание |
|--------|-----------|----------|
| ⚠️ | 1 | Жжёт испарики как мразь |
| 🌪 | 2 | Сушит - душит |
| 🧼 | 3 | Мыльный вкус |
| 🍯 | 4 | Быстро надоедает |
| 💎 | 5 | Редкий товар |

**Приоритет влияет на порядок отображения** (⚠️ всегда первая).

### Поиск

- Поле в шапке сайта
- Фильтрация по названию вкуса
- Крестик для очистки (появляется при вводе)

### Дополнительные функции

| Функция | Описание |
|---------|----------|
| **Скролл вверх** | Кнопка справа снизу (появляется при скролле) |
| **Telegram канал** | Кнопка справа сверху (бордовый круг) |
| **Масштаб 1.25x** | Увеличенный интерфейс (zoom: 1.25) |
| **Дубликаты** | Проверка уникальности названия вкуса |

---

## 🎨 Стили и дизайн

### Цветовая палитра

```css
:root {
    --bg-dark: #1a1a2e;          /* Тёмно-синий фон */
    --bg-card: #16213e;          /* Фон карточек */
    --bg-modal: #1f2a48;         /* Фон модальных окон */
    --accent: #e94560;           /* Акцентный (бордовый) */
    --accent-hover: #ff6b8a;     /* Акцент при наведении */
    --text-primary: #ffffff;     /* Белый текст */
    --text-secondary: #a0a0a0;   /* Серый текст */
    --purple: #9b59b6;           /* Фиолетовый (Саша) */
    --pink: #ff69b4;             /* Розовый (Настя) */
}
```

### Шрифты

- **Основной:** Galaktika (кастомный, `Шрифт/TTF/Galaktika.ttf`)
- **Резервный:** Inter (Google Fonts)
- **Размер:** 16px базовый, 30px для названий

### Анимации

| Элемент | Анимация | Описание |
|---------|----------|----------|
| **Карточка** | `translateY(-8px)` | Поднятие при наведении |
| **Пар** | `smokePulse`, `smokeDrift` | Клубы розового пара |
| **Кнопки** | `scale`, `background` | Увеличение, изменение цвета |
| **Иконка предупреждения** | `shake` | Тряска при открытии |

---

## 💻 Разработка

### Git Workflow

```bash
# Основная ветка (продакшен)
git checkout main
git push origin main

# Ветка для разработки
git checkout -b dev
# ... вносим изменения ...
git commit -m "Новая фича"
git push origin dev

# Слияние
git checkout main
git merge dev
git push origin main
```

### Локальный запуск

1. Откройте `index.html` в браузере
2. Или используйте Live Server в VSCode

### Публикация изменений

```bash
git add .
git commit -m "Описание изменений"
git push origin main
```

**GitHub Pages обновится через 2-3 минуты.**

---

## 🚀 Публикация

### GitHub Pages

**URL:** https://tryhardgg.github.io/vape-rating-app/

**Настройки:**
- Settings → Pages
- Branch: `main`
- Folder: `/ (root)`

### Supabase

**Dashboard:** https://supabase.com/dashboard/project/ajihwuotwwogahsgqdnv

**SQL для инициализации:**

```sql
-- Добавить колонку is_other
ALTER TABLE cards ADD COLUMN IF NOT EXISTS is_other BOOLEAN DEFAULT false;

-- Создать уникальный индекс
CREATE UNIQUE INDEX IF NOT EXISTS idx_cards_card_id ON cards(card_id);

-- RLS Policy
CREATE POLICY "Доступ всем" ON cards
FOR ALL USING (true) WITH CHECK (true);
```

---

## 📋 Планы на будущее

См. файл [FUTURE_PLANS.md](../FUTURE_PLANS.md)

**Приоритетные задачи:**

- [ ] Тёмная/светлая тема
- [ ] Экспорт данных в CSV
- [ ] Фильтры по категориям
- [ ] Статистика (средний рейтинг, топ вкусов)

---

## 📞 Контакты

- **GitHub:** [@tryhardgg](https://github.com/tryhardgg)
- **Telegram:** [@bizonopt_1](https://t.me/bizonopt_1)

---

**Документация актуальна для версии 1.0.0**  
**Последнее обновление:** 2026-04-01
