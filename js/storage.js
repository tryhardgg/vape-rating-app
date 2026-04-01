/**
 * MONSTER VAPOR TRACKER - ХРАНИЛИЩЕ ДАННЫХ
 * Работа с localStorage для сохранения состояния приложения
 */

const STORAGE_KEY = 'monsterVaporTrackerData';

/**
 * Сохраняет всё состояние приложения в localStorage
 * @param {Object} data - данные для сохранения
 * @returns {boolean} успешно ли сохранение
 */
function saveData(data) {
    try {
        const serialized = JSON.stringify(data);
        localStorage.setItem(STORAGE_KEY, serialized);
        return true;
    } catch (error) {
        // Игнорируем ошибку переполнения (Supabase теперь основной)
        if (error.name === 'QuotaExceededError') {
            console.warn('⚠️ localStorage переполнен, используем только Supabase');
            return false;
        }
        console.error('Ошибка сохранения данных:', error);
        return false;
    }
}

/**
 * Загружает сохранённые данные из localStorage
 * @returns {Object|null} загруженные данные или null если их нет
 */
function loadData() {
    try {
        const serialized = localStorage.getItem(STORAGE_KEY);
        if (serialized === null) {
            return null;
        }
        return JSON.parse(serialized);
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        return null;
    }
}

/**
 * Сохраняет одну карточку в хранилище
 * @param {string|number} id - идентификатор карточки
 * @param {Object} cardData - данные карточки
 * @param {Array} allCards - весь массив карточек для обновления
 * @returns {Array} обновлённый массив карточек
 */
async function saveCard(id, cardData, allCards) {
    const index = allCards.findIndex(card => card.id === id);
    
    if (index !== -1) {
        // Обновляем существующую карточку
        allCards[index] = { ...allCards[index], ...cardData };
    } else {
        // Добавляем новую карточку
        allCards.push(cardData);
    }
    
    // Пробуем сохранить в localStorage, но игнорируем ошибку переполнения
    saveData({ cards: allCards });
    
    // Сохраняем в Supabase
    if (typeof saveCardToSupabase === 'function') {
        await saveCardToSupabase(allCards[index]);
    }
    
    return allCards;
}

/**
 * Получает одну карточку по ID
 * @param {string|number} id - идентификатор карточки
 * @param {Array} allCards - весь массив карточек
 * @returns {Object|null} найденная карточка или null
 */
function getCard(id, allCards) {
    const card = allCards.find(card => card.id === id);
    return card || null;
}

/**
 * Удаляет карточку из хранилища
 * @param {string|number} id - идентификатор карточки
 * @param {Array} allCards - весь массив карточек
 * @returns {Array} обновлённый массив карточек
 */
function deleteCard(id, allCards) {
    const filtered = allCards.filter(card => card.id !== id);
    
    // Пробуем сохранить в localStorage, но игнорируем ошибку переполнения
    saveData({ cards: filtered });
    
    return filtered;
}

/**
 * Очищает все данные в хранилище (для тестов)
 * @returns {boolean} успешно ли очищено
 */
function clearAll() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Ошибка очистки данных:', error);
        return false;
    }
}

/**
 * Получает карточки для вкладки Other (пользовательские)
 * @param {Array} allCards - весь массив карточек
 * @returns {Array} карточки Other
 */
function getOtherCards(allCards) {
    return allCards.filter(card => card.isOther === true);
}

/**
 * Получает карточки для вкладки MV (Monster Vapor)
 * @param {Array} allCards - весь массив карточек
 * @returns {Array} карточки MV
 */
function getMVCards(allCards) {
    return allCards.filter(card => card.isOther !== true);
}

// Экспорт функций
window.MonsterVaporStorage = {
    saveData,
    loadData,
    saveCard,
    getCard,
    deleteCard,
    clearAll,
    getOtherCards,
    getMVCards
};
