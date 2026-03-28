# 🚀 Monster Vapor Tracker

Приложение для оценки жидкостей Monster Vapor с синхронизацией между устройствами.

---

## 📋 Оглавление

1. [О проекте](#о-проекте)
2. [Установка Git](#установка-git)
3. [Настройка GitHub](#настройка-github)
4. [Настройка Supabase](#настройка-supabase)
5. [Подключение Supabase к проекту](#подключение-supabase-к-проекту)
6. [Публикация на GitHub Pages](#публикация-на-github-pages)
7. [Словарь терминов](#словарь-терминов)
8. [Частые проблемы](#частые-проблемы)

---

## ℹ️ О проекте

**Monster Vapor Tracker** — веб-приложение для оценки жидкостей для вейпа.

**Возможности:**
- ✅ 34 карточки Monster Vapor
- ✅ Рейтинги (Саша + Настя)
- ✅ Иконки-индикаторы (🌪💎⚠️🧼🍯)
- ✅ Примечания к карточкам
- ✅ Загрузка своих изображений
- ✅ **Синхронизация между устройствами** (Supabase)

**Ссылка на сайт:** `https://ВАШ_НИК.github.io/vape-rating-app/`

---

## 🔧 Установка Git

### Шаг 1: Скачать Git

1. Перейдите на [git-scm.com](https://git-scm.com/download/win)
2. Скачайте версию для Windows
3. Запустите установщик

### Шаг 2: Установить Git

1. Нажимайте **Next** (настройки по умолчанию)
2. Выберите редактор (VSCode или Notepad++)
3. Нажмите **Install**
4. Готово!

### Шаг 3: Проверить установку

Откройте терминал в VSCode (Ctrl+`) и выполните:

```bash
git --version
```

Если увидели версию (например, `git version 2.45.0`) — ✅ установлено!

---

## 🐙 Настройка GitHub

### Шаг 1: Создать аккаунт

1. Перейдите на [github.com](https://github.com)
2. Нажмите **Sign up**
3. Введите email, пароль, придумайте никнейм
4. Подтвердите email
5. Готово!

### Шаг 2: Создать репозиторий

1. На GitHub нажмите **+** → **New repository**
2. Заполните:
   - **Repository name:** `vape-rating-app`
   - **Description:** `Monster Vapor Tracker - рейтинг жидкостей`
   - **Public:** ✅ (галочка)
   - **Initialize with README:** ❌ (без галочки)
3. Нажмите **Create repository**

### Шаг 3: Настроить Git локально

В терминале VSCode выполните:

```bash
git config --global user.name "ВАШ_НИК"
git config --global user.email "ВАШ_EMAIL"
```

**Пример:**
```bash
git config --global user.name "tryhard"
git config --global user.email "tryhard@mail.ru"
```

### Шаг 4: Инициализировать Git в проекте

В терминале VSCode (в папке проекта):

```bash
git init
git add .
git commit -m "Первый коммит: Monster Vapor Tracker"
```

### Шаг 5: Привязать репозиторий

На GitHub скопируйте команду из раздела "Quick setup":

```bash
git remote add origin https://github.com/ВАШ_НИК/vape-rating-app.git
```

Выполните в терминале VSCode.

### Шаг 6: Отправить код на GitHub

```bash
git branch -M main
git push -u origin main
```

**Готово!** Код на GitHub! 🎉

---

## 🗄️ Настройка Supabase

### Шаг 1: Регистрация

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите **Start your project**
3. Войдите через GitHub (рекомендую) или email
4. Готово!

### Шаг 2: Создать проект

1. Нажмите **New project**
2. Заполните:
   - **Name:** `vape-rating-app`
   - **Database password:** придумайте сложный пароль ⚠️ **СОХРАНИТЕ!**
   - **Region:** Europe (Frankfurt) — ближайшая к вам
3. Нажмите **Create new project**
4. Подождите 2-3 минуты

### Шаг 3: Создать таблицу `cards`

1. Перейдите в **Table Editor** (иконка таблицы слева)
2. Нажмите **New table**
3. Заполните:
   - **Name:** `cards`
   - **Enable Row Level Security:** ✅ (галочка)
4. Добавьте колонки:

| Name | Type | Default | Primary |
|------|------|---------|---------|
| `id` | int8 | autoincrement | ✅ |
| `card_id` | text | - | - |
| `flavor` | text | - | - |
| `note` | text | - | - |
| `image` | text | - | - |
| `rating_sasha` | float8 | - | - |
| `rating_nastya` | float8 | - | - |
| `emojis` | jsonb | - | - |
| `is_filled` | bool | false | - |
| `created_at` | timestamptz | now() | - |
| `updated_at` | timestamptz | now() | - |

5. Нажмите **Save**

### Шаг 4: Получить API ключи

1. Перейдите в **Settings** → **API**
2. Скопируйте 2 значения:
   - **Project URL:** `https://XXXXXXXXX.supabase.co`
   - **anon/public key:** `eyJhbG...` (длинная строка)

⚠️ **СОХРАНИТЕ ЭТИ КЛЮЧИ!** Они понадобятся для кода.

### Шаг 5: Настроить доступ (RLS)

1. В Table Editor выберите таблицу `cards`
2. Перейдите во вкладку **RLS policy**
3. Нажмите **New policy**
4. Выберите **For full customization**
5. Вставьте SQL:

```sql
CREATE POLICY "Доступ всем" ON cards
FOR ALL USING (true) WITH CHECK (true);
```

6. Нажмите **Review** → **Save policy**

---

## 🔌 Подключение Supabase к проекту

### Шаг 1: Создать файл конфигурации

Создайте файл `js/supabase-config.js` с содержимым:

```javascript
// Supabase конфигурация
const SUPABASE_URL = 'https://ВАШ_PROJECT_ID.supabase.co';
const SUPABASE_KEY = 'ВАШ_ANON_KEY';

// Инициализация клиента Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
```

**Замените:**
- `ВАШ_PROJECT_ID` — из Project URL
- `ВАШ_ANON_KEY` — из anon/public key

### Шаг 2: Добавить библиотеку Supabase

В `index.html` перед подключением ваших скриптов добавьте:

```html
<!-- Supabase библиотека -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Ваши скрипты -->
<script src="js/supabase-config.js"></script>
<script src="js/data.js"></script>
<script src="js/storage.js"></script>
<script src="js/app.js"></script>
```

### Шаг 3: Обновить `storage.js`

**Я напишу код после того как вы выполните шаги 1-2!**

---

## 🌐 Публикация на GitHub Pages

### Шаг 1: Включить GitHub Pages

1. В репозитории перейдите в **Settings** (шестерёнка)
2. Слева выберите **Pages**
3. **Build and deployment:**
   - **Source:** Deploy from a branch
   - **Branch:** main → /(root)
4. Нажмите **Save**

### Шаг 2: Подождать

Подождите 2-3 минуты пока сайт опубликуется.

### Шаг 3: Проверить

Откройте ссылку вида:
```
https://ВАШ_НИК.github.io/vape-rating-app/
```

**Готово!** Сайт в интернете! 🎉

---

## 📖 Словарь терминов

| Термин | Значение | Пример |
|--------|----------|--------|
| **Репозиторий (repo)** | Папка с проектом на GitHub | "Создал репо для сайта" |
| **Коммит (commit)** | Сохранение изменений | "Сделал коммит новых фич" |
| **Пуш (push)** | Отправить код на GitHub | "Запушил код на сервер" |
| **Пулл (pull)** | Скачать код с GitHub | "Сделал пулл изменений" |
| **Мёрж (merge)** | Объединить изменения | "Замёржил ветку в основную" |
| **Ветка (branch)** | Копия проекта для разработки | "Создал ветку для теста" |
| **Форк (fork)** | Копия чужого репозитория | "Сделал форк проекта" |
| **Issue** | Задача/проблема в проекте | "Создал issue по багу" |
| **PR (Pull Request)** | Запрос на слияние кода | "Открыл PR на ревью" |
| **README** | Файл с описанием проекта | "Написал инструкцию в README" |
| **Deploy** | Разместить сайт в интернете | "Задеплоил на GitHub Pages" |
| **Local** | Локально (на вашем компьютере) | "Тестирую локально" |
| **Remote** | Удалённо (на сервере GitHub) | "Код на remote-репозитории" |

---

## ❓ Частые проблемы

### Проблема 1: `git is not recognized`

**Решение:**
1. Переустановите Git
2. Перезапустите VSCode
3. Проверьте: `git --version`

### Проблема 2: Ошибка при `git push`

**Решение:**
```bash
git remote -v  # Проверить подключение
git remote remove origin  # Удалить старое
git remote add origin https://github.com/НИК/vape-rating-app.git  # Добавить новое
git push -u origin main
```

### Проблема 3: GitHub Pages не работает (404)

**Решение:**
1. Проверьте что файл `index.html` в корне репозитория
2. Подождите 5 минут
3. Проверьте в Settings → Pages что ветка `main` выбрана

### Проблема 4: Supabase не подключается

**Решение:**
1. Проверьте ключи в `supabase-config.js`
2. Проверьте что RLS policy настроен
3. Откройте консоль (F12) и посмотрите ошибки

---

## 📚 Где хранить документацию

| Файл | Где хранить | Зачем |
|------|-------------|-------|
| **README.md** | Корень проекта | Основная инструкция |
| **CONTRIBUTING.md** | Корень проекта | Как вносить изменения |
| **CHANGELOG.md** | Корень проекта | История изменений |
| **docs/** | Папка в корне | Подробная документация |
| **.gitignore** | Корень проекта | Что не загружать в Git |

**Правильная структура проекта:**
```
vape-rating-app/
├── README.md          ← Основная инструкция
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── data.js
│   ├── storage.js
│   └── supabase-config.js
├── images/
└── .gitignore
```

---

## 🎯 Чек-лист завершения

- [ ] Git установлен
- [ ] Аккаунт на GitHub создан
- [ ] Репозиторий создан
- [ ] Код отправлен на GitHub (`git push`)
- [ ] GitHub Pages включён
- [ ] Supabase зарегистрирован
- [ ] Проект в Supabase создан
- [ ] Таблица `cards` создана
- [ ] API ключи получены
- [ ] RLS policy настроен
- [ ] Файл `supabase-config.js` создан
- [ ] Сайт доступен по ссылке
- [ ] Настя может открыть сайт

---

## 📞 Контакты

Если возникли проблемы — обращайтесь!

---

**Создано:** 2026-03-27  
**Версия:** 1.0.0  
**Лицензия:** MIT
