/**
 * MONSTER VAPOR TRACKER - ОСНОВНОЕ ПРИЛОЖЕНИЕ
 * Главная логика работы приложения
 */

// ============================================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ
// ============================================
let appState = {
    cards: [],
    currentTab: 'mv',
    searchQuery: '',
    currentEditingCardId: null,
    tempEmojis: [], // Один массив для всех иконок
    tempImage: null // Временное хранение изображения (base64)
};

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

/**
 * Инициализация приложения при загрузке страницы
 */
async function initApp() {
    // Загружаем данные из localStorage
    const savedData = MonsterVaporStorage.loadData();
    
    if (savedData && savedData.cards) {
        appState.cards = savedData.cards;
    } else {
        // Инициализируем данными Monster Vapor
        appState.cards = MonsterVaporData.initializeMonsterVaporData();
    }
    
    // Синхронизируемся с Supabase
    console.log('🔄 Syncing with Supabase...');
    const syncedCards = await syncWithSupabase(appState.cards);
    if (syncedCards && syncedCards.length > 0) {
        appState.cards = syncedCards;
        // НЕ сохраняем в localStorage (чтобы не переполнять)
        // MonsterVaporStorage.saveData({ cards: appState.cards });
    }
    console.log('✅ Sync complete!');
    
    // Инициализируем UI элементы
    initTabs();
    initSearch();
    initModal();
    initAddCardButton();
    initAddMvCardButton();
    initScrollToTop();
    
    // Рендерим карточки для текущей вкладки
    renderCurrentTab();
    
    console.log('Приложение инициализировано!', appState.cards.length, 'карточек');
}

// ============================================
// ВКЛАДКИ
// ============================================

/**
 * Инициализация переключения вкладок
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });
}

/**
 * Переключение на указанную вкладку
 * @param {string} tabName - название вкладки ('mv' или 'other')
 */
function switchTab(tabName) {
    appState.currentTab = tabName;
    
    // Обновляем активные кнопки
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Обновляем активный контент
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
    
    // Рендерим карточки
    renderCurrentTab();
}

/**
 * Рендерит карточки для текущей вкладки
 */
function renderCurrentTab() {
    if (appState.currentTab === 'mv') {
        renderMVCards();
    } else {
        renderOtherCards();
    }
}

// ============================================
// ПОИСК
// ============================================

/**
 * Инициализация поиска
 */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    
    searchInput.addEventListener('input', (e) => {
        appState.searchQuery = e.target.value.toLowerCase().trim();
        
        // Показываем/скрываем крестик
        clearSearchBtn.style.display = appState.searchQuery ? 'flex' : 'none';
        
        renderCurrentTab();
    });
    
    // Очистка поиска по клику на крестик
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        appState.searchQuery = '';
        clearSearchBtn.style.display = 'none';
        renderCurrentTab();
        searchInput.focus();
    });
}

/**
 * Фильтрует карточки по поисковому запросу
 * @param {Array} cards - массив карточек для фильтрации
 * @returns {Array} отфильтрованные карточки
 */
function filterCardsBySearch(cards) {
    if (!appState.searchQuery) {
        return cards;
    }

    return cards.filter(card => {
        const nameMatch = card.name ? card.name.toLowerCase().includes(appState.searchQuery) : false;
        const flavorMatch = card.flavor ? card.flavor.toLowerCase().includes(appState.searchQuery) : false;
        const brandMatch = card.brand ? card.brand.toLowerCase().includes(appState.searchQuery) : false;
        return nameMatch || flavorMatch || brandMatch;
    });
}

/**
 * Сортирует карточки по рейтингу (от высшего к низшему)
 * @param {Array} cards - массив карточек
 * @returns {Array} отсортированные карточки
 */
function sortCardsByRating(cards) {
    return [...cards].sort((a, b) => {
        const ratingA = a.averageRating !== null ? a.averageRating : -1;
        const ratingB = b.averageRating !== null ? b.averageRating : -1;
        return ratingB - ratingA;
    });
}

// ============================================
// ОТРИСОВКА КАРТОЧЕК
// ============================================

/**
 * Рендерит карточки Monster Vapor
 */
function renderMVCards() {
    const grid = document.getElementById('mv-grid');
    // Фильтруем карточки MV (не Other)
    const mvCards = appState.cards.filter(card => card.isOther !== true);
    const filtered = filterCardsBySearch(mvCards);
    const sorted = sortCardsByRating(filtered);

    console.log('renderMVCards:', mvCards.length, 'карточек, отфильтровано:', filtered.length);

    grid.innerHTML = '';

    sorted.forEach(card => {
        const cardElement = createCardElement(card);
        grid.appendChild(cardElement);
    });
}

/**
 * Рендерит карточки Other (пользовательские)
 */
function renderOtherCards() {
    const grid = document.getElementById('other-grid');
    const otherCards = MonsterVaporStorage.getOtherCards(appState.cards);
    const filtered = filterCardsBySearch(otherCards);
    const sorted = sortCardsByRating(filtered);
    
    grid.innerHTML = '';
    
    sorted.forEach(card => {
        const cardElement = createCardElement(card);
        grid.appendChild(cardElement);
    });
}

/**
 * Создаёт HTML элемент карточки
 * @param {Object} card - данные карточки
 * @returns {HTMLElement} элемент карточки
 */
function createCardElement(card) {
    const div = document.createElement('div');
    div.className = `card ${!card.isFilled ? 'empty' : ''}`;
    div.dataset.id = card.id;
    
    // Изображение
    const imageDiv = document.createElement('div');
    imageDiv.className = 'card-image';

    if (card.image) {
        // Используем изображение из данных
        const img = document.createElement('img');
        img.src = card.image;
        img.alt = card.name;
        imageDiv.appendChild(img);
    } else if (card.isFilled && card.flavor) {
        // Генерируем SVG с названием на основе цвета (резервный вариант)
        const svg = generateBottleSVG(card.name, card.color || '#e94560');
        imageDiv.style.background = `linear-gradient(135deg, ${card.color || '#e94560'}40, ${card.color || '#e94560'}90)`;
        imageDiv.innerHTML = svg;
    } else {
        imageDiv.textContent = '💧';
    }

    div.appendChild(imageDiv);

    // Добавляем частицы пара для анимации (только для заполненных карточек)
    if (card.isFilled) {
        const vapor1 = document.createElement('div');
        vapor1.className = 'vapor vapor-1';
        imageDiv.appendChild(vapor1);

        const vapor2 = document.createElement('div');
        vapor2.className = 'vapor vapor-2';
        imageDiv.appendChild(vapor2);

        const vapor3 = document.createElement('div');
        vapor3.className = 'vapor vapor-3';
        imageDiv.appendChild(vapor3);

        const vapor4 = document.createElement('div');
        vapor4.className = 'vapor vapor-4';
        imageDiv.appendChild(vapor4);

        const vapor5 = document.createElement('div');
        vapor5.className = 'vapor vapor-5';
        imageDiv.appendChild(vapor5);
    }

    // Название вкуса
    const flavorDiv = document.createElement('div');
    flavorDiv.className = 'card-flavor';
    flavorDiv.textContent = card.flavor || 'Не заполнено';
    div.appendChild(flavorDiv);

    // Рейтинг badge
    if (card.averageRating !== null) {
        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'card-rating';
        ratingDiv.textContent = card.averageRating.toFixed(1);
        div.appendChild(ratingDiv);
    }

    // Эмодзи - простое отображение
    const cardEmojis = card.emojis || [];
    
    if (cardEmojis.length > 0) {
        const emojisDiv = document.createElement('div');
        emojisDiv.className = 'card-emojis';

        // Сортируем иконки по приоритету
        const sortedEmojis = sortEmojisByPriority(cardEmojis);

        sortedEmojis.forEach(emoji => {
            const emojiSpan = document.createElement('span');
            emojiSpan.className = 'card-emoji';
            emojiSpan.textContent = emoji;
            emojisDiv.appendChild(emojiSpan);
        });

        div.appendChild(emojisDiv);
    }
    
    // Tooltip с примечанием
    if (card.note) {
        const tooltipDiv = document.createElement('div');
        tooltipDiv.className = 'tooltip';
        tooltipDiv.textContent = card.note;
        div.appendChild(tooltipDiv);
    }
    
    // Клик для открытия модального окна
    div.addEventListener('click', () => openModal(card.id));
    
    return div;
}

/**
 * Возвращает эмодзи для отображения на карточке
 * @param {Object} card - данные карточки
 * @returns {Array} массив объектов {emoji, class}
 */
function getDisplayedEmojis(card) {
    const result = [];
    const emojisSasha = card.emojisSasha || [];
    const emojisNastya = card.emojisNastya || [];
    
    // Объединяем иконки от обоих
    const allEmojis = new Set([...emojisSasha, ...emojisNastya]);

    allEmojis.forEach(emoji => {
        const inSasha = emojisSasha.includes(emoji);
        const inNastya = emojisNastya.includes(emoji);

        let className = '';
        if (inSasha && inNastya) {
            className = 'both';
        } else if (inSasha) {
            className = 'sasha';
        } else if (inNastya) {
            className = 'nastya';
        }

        result.push({ emoji: emoji, class: className });
    });

    return result;
}

// ============================================
// МОДАЛЬНОЕ ОКНО
// ============================================

/**
 * Инициализация модального окна
 */
function initModal() {
    const modal = document.getElementById('cardModal');
    const closeBtn = document.getElementById('modalClose');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    
    // Закрытие по крестику
    closeBtn.addEventListener('click', closeModal);
    
    // Закрытие по кнопке отмены
    cancelBtn.addEventListener('click', closeModal);
    
    // Закрытие по клику вне окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Сохранение
    saveBtn.addEventListener('click', saveCurrentCard);
    
    // Удаление
    deleteBtn.addEventListener('click', deleteCurrentCard);
    
    // Инициализация select с рейтингами
    initRatingSelects();
    
    // Инициализация выбора эмодзи
    initEmojiSelector();
    
    // Инициализация загрузки изображений
    initImageUpload();
    
    // Авто-расчёт среднего рейтинга
    document.getElementById('ratingSasha').addEventListener('change', updateAverageRating);
    document.getElementById('ratingNastya').addEventListener('change', updateAverageRating);
}

/**
 * Инициализация select элементов с рейтингами (0-10, шаг 0.5)
 */
function initRatingSelects() {
    const sashaSelect = document.getElementById('ratingSasha');
    const nastyaSelect = document.getElementById('ratingNastya');
    
    // Опция "-"
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-';
    
    sashaSelect.appendChild(defaultOption.cloneNode(true));
    nastyaSelect.appendChild(defaultOption.cloneNode(true));
    
    // Опции 0-10 с шагом 0.5
    for (let i = 0; i <= 10; i += 0.5) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i.toFixed(1);
        
        sashaSelect.appendChild(option.cloneNode(true));
        nastyaSelect.appendChild(option.cloneNode(true));
    }
}

/**
 * Инициализация выбора эмодзи (один ряд для всех)
 */
function initEmojiSelector() {
    const emojiContainer = document.getElementById('emojiSelector');
    
    emojiContainer.querySelectorAll('.emoji').forEach(emojiEl => {
        emojiEl.addEventListener('click', () => {
            toggleEmoji(emojiEl.dataset.emoji);
        });
    });
}

/**
 * Инициализация загрузки изображений
 */
function initImageUpload() {
    const fileInput = document.getElementById('cardImage');
    const removeBtn = document.getElementById('removeImageBtn');
    const imagePreview = document.getElementById('imagePreview');
    
    // Обработка выбора файла
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                appState.tempImage = event.target.result;
                updateImagePreview();
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Обработка удаления изображения
    removeBtn.addEventListener('click', () => {
        appState.tempImage = null;
        fileInput.value = '';
        updateImagePreview();
    });
}

/**
 * Обновляет превью изображения в модальном окне
 */
function updateImagePreview() {
    const preview = document.getElementById('imagePreview');
    const removeBtn = document.getElementById('removeImageBtn');
    
    if (appState.tempImage) {
        preview.innerHTML = `<img src="${appState.tempImage}" alt="Preview">`;
        removeBtn.style.display = 'block';
    } else {
        preview.innerHTML = '<span class="preview-placeholder">💧</span>';
        removeBtn.style.display = 'none';
    }
}

/**
 * Переключает состояние эмодзи
 * @param {string} emoji - символ эмодзи
 */
function toggleEmoji(emoji) {
    const index = appState.tempEmojis.indexOf(emoji);

    if (index !== -1) {
        appState.tempEmojis.splice(index, 1);
    } else {
        appState.tempEmojis.push(emoji);
    }

    updateEmojiSelector();
    updateSelectedEmojisPreview();
}

/**
 * Обновляет визуальное состояние селектора эмодзи
 */
function updateEmojiSelector() {
    document.getElementById('emojiSelector').querySelectorAll('.emoji').forEach(emojiEl => {
        const emoji = emojiEl.dataset.emoji;
        const isSelected = appState.tempEmojis.includes(emoji);
        emojiEl.classList.toggle('selected', isSelected);
    });
}

/**
 * Обновляет превью выбранных эмодзи
 */
function updateSelectedEmojisPreview() {
    const container = document.getElementById('selectedEmojis');
    
    if (appState.tempEmojis.length === 0) {
        container.innerHTML = '<span class="empty-hint">Выберите иконки</span>';
        return;
    }
    
    // Сортируем иконки по приоритету
    const sortedEmojis = sortEmojisByPriority(appState.tempEmojis);
    
    container.innerHTML = '';
    
    sortedEmojis.forEach(emoji => {
        const span = document.createElement('span');
        span.className = 'card-emoji';
        span.textContent = emoji;
        container.appendChild(span);
    });
}

/**
 * Сортирует иконки по приоритету
 * @param {Array} emojis - массив иконок
 * @returns {Array} отсортированный массив
 */
function sortEmojisByPriority(emojis) {
    const priority = ['⚠️', '🌪', '🧼', '🍯', '💎'];
    
    return [...emojis].sort((a, b) => {
        const indexA = priority.indexOf(a);
        const indexB = priority.indexOf(b);
        
        // Если иконки нет в приоритете, отправляем в конец
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        
        return indexA - indexB;
    });
}

/**
 * Открывает модальное окно для редактирования карточки
 * @param {string|number} cardId - идентификатор карточки
 */
function openModal(cardId) {
    const card = MonsterVaporStorage.getCard(cardId, appState.cards);
    if (!card) return;

    appState.currentEditingCardId = cardId;

    // Заполняем поля данными карточки
    document.getElementById('flavorName').value = card.flavor || '';
    document.getElementById('note').value = card.note || '';

    // Устанавливаем рейтинги
    document.getElementById('ratingSasha').value = card.ratingSasha !== null ? card.ratingSasha : '';
    document.getElementById('ratingNastya').value = card.ratingNastya !== null ? card.ratingNastya : '';

    // Копируем иконки во временное хранилище (объединяем старые данные)
    const allCardEmojis = new Set([...(card.emojisSasha || []), ...(card.emojisNastya || [])]);
    appState.tempEmojis = [...allCardEmojis];

    // Копируем изображение во временное хранилище
    appState.tempImage = card.image || null;

    // Обновляем UI
    updateAverageRating();
    updateEmojiSelector();
    updateSelectedEmojisPreview();
    updateImagePreview();

    // Показываем/скрываем кнопку удаления
    const deleteBtn = document.getElementById('deleteBtn');
    deleteBtn.style.display = (card.isOther || card.isUserAdded) ? 'block' : 'none';

    // Показываем модальное окно
    const modal = document.getElementById('cardModal');
    modal.classList.add('active');
}

/**
 * Закрывает модальное окно
 */
function closeModal() {
    const modal = document.getElementById('cardModal');
    modal.classList.remove('active');

    appState.currentEditingCardId = null;
    appState.tempEmojis = [];
    appState.tempImage = null;
}

/**
 * Обновляет отображение среднего рейтинга
 */
function updateAverageRating() {
    const sashaValue = document.getElementById('ratingSasha').value;
    const nastyaValue = document.getElementById('ratingNastya').value;
    
    const sashaRating = sashaValue ? parseFloat(sashaValue) : null;
    const nastyaRating = nastyaValue ? parseFloat(nastyaValue) : null;
    
    const average = MonsterVaporData.calculateAverageRating(sashaRating, nastyaRating);
    
    const averageEl = document.getElementById('averageRating');
    averageEl.textContent = average !== null ? average.toFixed(1) : '-';
}

/**
 * Сохраняет текущую карточку
 */
function saveCurrentCard() {
    const cardId = appState.currentEditingCardId;
    if (!cardId) return;

    const card = MonsterVaporStorage.getCard(cardId, appState.cards);
    if (!card) return;

    // Обновляем данные
    card.flavor = document.getElementById('flavorName').value.trim();
    card.note = document.getElementById('note').value.trim();
    card.image = appState.tempImage; // Сохраняем изображение

    const sashaValue = document.getElementById('ratingSasha').value;
    const nastyaValue = document.getElementById('ratingNastya').value;

    card.ratingSasha = sashaValue ? parseFloat(sashaValue) : null;
    card.ratingNastya = nastyaValue ? parseFloat(nastyaValue) : null;
    card.emojis = [...appState.tempEmojis]; // Сохраняем иконки в одном массиве
    card.averageRating = MonsterVaporData.calculateAverageRating(card.ratingSasha, card.ratingNastya);
    card.isFilled = !!(card.flavor || card.ratingSasha !== null || card.ratingNastya !== null);

    // Сохраняем
    MonsterVaporStorage.saveCard(cardId, card, appState.cards);

    // Перерисовываем
    renderCurrentTab();

    // Закрываем модальное окно
    closeModal();
}

/**
 * Удаляет текущую карточку
 */
async function deleteCurrentCard() {
    const cardId = appState.currentEditingCardId;
    if (!cardId) return;

    const card = MonsterVaporStorage.getCard(cardId, appState.cards);
    // Можно удалять Other карточки или MV карточки, добавленные пользователем
    if (!card || (!card.isOther && !card.isUserAdded)) return;

    if (confirm('Вы уверены, что хотите удалить эту карточку?')) {
        appState.cards = await MonsterVaporStorage.deleteCard(cardId, appState.cards);
        renderCurrentTab();
        closeModal();
    }
}

// ============================================
// ДОБАВЛЕНИЕ НОВОЙ КАРТОЧКИ
// ============================================

/**
 * Инициализация кнопки добавления карточки (Other/Эксперименты)
 */
function initAddCardButton() {
    const addBtn = document.getElementById('addCardBtn');
    addBtn.addEventListener('click', () => {
        addNewCard('other');
    });
}

/**
 * Инициализация кнопки добавления MV карточки
 */
function initAddMvCardButton() {
    const addBtn = document.getElementById('addMvCardBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            addNewCard('mv');
        });
    }
}

/**
 * Инициализация кнопки скролла вверх
 */
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    
    // Показываем/скрываем кнопку при скролле
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'flex';
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.style.display = 'none';
            scrollBtn.classList.remove('show');
        }
    });
    
    // Скролл вверх при клике
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Добавляет новую карточку
 * @param {string} type - 'mv' или 'other'
 */
function addNewCard(type = 'other') {
    const newCard = MonsterVaporData.createEmptyCard({
        id: Date.now(),
        name: 'New Flavor',
        flavor: '',
        brand: type === 'mv' ? 'Monster Vapor' : 'Custom',
        isUserAdded: type === 'mv', // MV карточки, добавленные пользователем
        isOther: type === 'other' // Эксперименты
    }, type === 'other');

    appState.cards.push(newCard);
    MonsterVaporStorage.saveData({ cards: appState.cards });

    // Переключаемся на нужную вкладку и открываем модальное окно
    switchTab(type);
    openModal(newCard.id);
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

/**
 * Генерирует градиент на основе строки
 * @param {string} str - строка для генерации
 * @returns {string} CSS градиент
 */
function generateGradientFromString(str) {
    const colors = [
        'linear-gradient(135deg, #e94560, #0f3460)',
        'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
        'linear-gradient(135deg, #a8e063, #56ab2f)',
        'linear-gradient(135deg, #f093fb, #f5576c)',
        'linear-gradient(135deg, #4facfe, #00f2fe)',
        'linear-gradient(135deg, #667eea, #764ba2)',
        'linear-gradient(135deg, #fa709a, #fee140)',
        'linear-gradient(135deg, #30cfd0, #330867)',
        'linear-gradient(135deg, #a8edea, #fed6e3)',
        'linear-gradient(135deg, #ff9a9e, #fecfef)'
    ];
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
}

/**
 * Возвращает эмодзи на основе названия вкуса
 * @param {string} name - название вкуса
 * @returns {string} эмодзи
 */
function getFlavorEmoji(name) {
    const lowerName = name.toLowerCase();

    if (lowerName.includes('apple')) return '🍎';
    if (lowerName.includes('grape')) return '🍇';
    if (lowerName.includes('berry') || lowerName.includes('cranberry')) return '🫐';
    if (lowerName.includes('kiwi')) return '🥝';
    if (lowerName.includes('strawberry')) return '🍓';
    if (lowerName.includes('peach')) return '🍑';
    if (lowerName.includes('mango')) return '🥭';
    if (lowerName.includes('lemon')) return '🍋';
    if (lowerName.includes('cola')) return '🥤';
    if (lowerName.includes('cherry')) return '🍒';
    if (lowerName.includes('banana')) return '🍌';
    if (lowerName.includes('pineapple')) return '🍍';
    if (lowerName.includes('barbaris') || lowerName.includes('barb')) return '🔴';

    return '💧';
}

/**
 * Генерирует SVG изображение флакона с названием
 * @param {string} name - название вкуса
 * @param {string} color - основной цвет
 * @returns {string} SVG строка
 */
function generateBottleSVG(name, color) {
    const shortName = name.length > 18 ? name.substring(0, 16) + '...' : name;
    
    return `
        <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
                <linearGradient id="bottleGrad-${name}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${color};stop-opacity:0.9" />
                    <stop offset="100%" style="stop-color:${color};stop-opacity:0.3" />
                </linearGradient>
                <filter id="glow-${name}">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                </filter>
            </defs>
            
            <!-- Форма флакона -->
            <path d="M60 20 L140 20 L150 40 L150 280 Q150 295 100 295 Q50 295 50 280 L50 40 Z" 
                  fill="url(#bottleGrad-${name})" 
                  stroke="${color}" 
                  stroke-width="2"/>
            
            <!-- Этикетка -->
            <rect x="55" y="100" width="90" height="120" rx="5" 
                  fill="rgba(255,255,255,0.15)" 
                  stroke="rgba(255,255,255,0.3)" 
                  stroke-width="1"/>
            
            <!-- Название бренда -->
            <text x="100" y="130" text-anchor="middle" 
                  font-family="Arial, sans-serif" 
                  font-size="10" 
                  fill="rgba(255,255,255,0.7)" 
                  letter-spacing="2">MONSTER</text>
            <text x="100" y="145" text-anchor="middle" 
                  font-family="Arial, sans-serif" 
                  font-size="10" 
                  fill="rgba(255,255,255,0.7)" 
                  letter-spacing="2">VAPOR</text>
            
            <!-- Название вкуса -->
            <text x="100" y="175" text-anchor="middle" 
                  font-family="Arial, sans-serif" 
                  font-size="11" 
                  font-weight="bold" 
                  fill="#ffffff"
                  filter="url(#glow-${name})">
                ${shortName}
            </text>
            
            <!-- Логотип M -->
            <text x="100" y="70" text-anchor="middle" 
                  font-family="Arial, sans-serif" 
                  font-size="36" 
                  font-weight="bold" 
                  fill="rgba(255,255,255,0.2)">M</text>
        </svg>
    `;
}

// ============================================
// СБРОС ДАННЫХ (для отладки)
// ============================================

/**
 * Сбрасывает все данные и инициализирует заново
 * Вызовите в консоли: resetAppData()
 */
function resetAppData() {
    MonsterVaporStorage.clearAll();
    appState.cards = MonsterVaporData.initializeMonsterVaporData();
    MonsterVaporStorage.saveData({ cards: appState.cards });
    renderCurrentTab();
    console.log('Данные сброшены! Создано', appState.cards.length, 'карточек Monster Vapor');
}

// ============================================
// ЗАПУСК ПРИЛОЖЕНИЯ
// ============================================

// Ждём загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);
