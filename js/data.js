/**
 * MONSTER VAPOR TRACKER - ДАННЫЕ
 * Полный список всех вкусов Monster Vapor 20mg крепости
 */

// Исходные данные всех вкусов Monster Vapor (34 вкуса)
const monsterVaporFlavors = [
    { id: 1, name: "Barawolf", flavor: "Малина и барбарис", brand: "Monster Vapor", color: "#e94560", image: "images/monster-vapor/Barawolf.svg" },
    { id: 2, name: "Barbahybrid", flavor: "Барбарис с вишней", brand: "Monster Vapor", color: "#c0392b", image: "images/monster-vapor/Barbahybrid.svg" },
    { id: 3, name: "Baba Banana", flavor: "Сладкие груши и бананы", brand: "Monster Vapor", color: "#f1c40f", image: "images/monster-vapor/Baba_Banana.svg" },
    { id: 4, name: "Banampus", flavor: "Банан и дыня", brand: "Monster Vapor", color: "#f39c12", image: "images/monster-vapor/Banampus.svg" },
    { id: 5, name: "Berry Jack", flavor: "Клубника с арбузом со льдом", brand: "Monster Vapor", color: "#e74c3c", image: "images/monster-vapor/Berry_Jack.svg" },
    { id: 6, name: "Big Foot Cola", flavor: "Насыщенная кола с виноградным послевкусием", brand: "Monster Vapor", color: "#2c3e50", image: "images/monster-vapor/Big_Foot_Cola.svg" },
    { id: 7, name: "Crappbie", flavor: "Зеленое яблоко и клюква", brand: "Monster Vapor", color: "#27ae60", image: "images/monster-vapor/Crappbie.svg" },
    { id: 8, name: "Currummy", flavor: "Грейпфрут и смородина", brand: "Monster Vapor", color: "#8e44ad", image: "images/monster-vapor/Currummy.svg" },
    { id: 9, name: "Grape Cola", flavor: "Виноградная кола", brand: "Monster Vapor", color: "#9b59b6", image: "images/monster-vapor/Grape_Cola.svg" },
    { id: 10, name: "Grapeena", flavor: "Виноградно-малиновый туман", brand: "Monster Vapor", color: "#8e44ad", image: "images/monster-vapor/Grapeena.svg" },
    { id: 11, name: "Grapefruit Raspberry", flavor: "Грейпфрут с малиной", brand: "Monster Vapor", color: "#e67e22", image: "images/monster-vapor/Grapefruit_Raspberry.svg" },
    { id: 12, name: "Ifritus", flavor: "Цитрусовый чай и мёд", brand: "Monster Vapor", color: "#d35400", image: "images/monster-vapor/Ifritus.svg" },
    { id: 13, name: "Jotun Pine", flavor: "Ананас, кокос и мята", brand: "Monster Vapor", color: "#1abc9c", image: "images/monster-vapor/Jotun_Pine.svg" },
    { id: 14, name: "Kiwi Apple", flavor: "Киви с яблоком", brand: "Monster Vapor", color: "#8bc34a", image: "images/monster-vapor/Kiwi_Apple.svg" },
    { id: 15, name: "Leshberry", flavor: "Дикая малина и ежевика", brand: "Monster Vapor", color: "#c0392b", image: "images/monster-vapor/Leshberry.svg" },
    { id: 16, name: "Limelops", flavor: "Лимоны и лаймы", brand: "Monster Vapor", color: "#f1c40f", image: "images/monster-vapor/Limelops.svg" },
    { id: 17, name: "Mango King", flavor: "Манго и маракуйя", brand: "Monster Vapor", color: "#ff9800", image: "images/monster-vapor/Mango_King.svg" },
    { id: 18, name: "Cola Kong", flavor: "Кола и лимон", brand: "Monster Vapor", color: "#34495e", image: "images/monster-vapor/Cola_Kong.svg" },
    { id: 19, name: "Cola Lemon", flavor: "Кола с лимоном", brand: "Monster Vapor", color: "#2c3e50", image: "images/monster-vapor/Cola_Lemon.svg" },
    { id: 20, name: "Mankicore", flavor: "Манго, лимоны и киви", brand: "Monster Vapor", color: "#ff6b35", image: "images/monster-vapor/Mankicore.svg" },
    { id: 21, name: "Manoraur", flavor: "Манго и апельсин", brand: "Monster Vapor", color: "#ff9800", image: "images/monster-vapor/Manoraur.svg" },
    { id: 22, name: "Neelhu", flavor: "Лесные ягоды и хвоя", brand: "Monster Vapor", color: "#16a085", image: "images/monster-vapor/Neelhu.svg" },
    { id: 23, name: "Peachansi", flavor: "Персик и банан", brand: "Monster Vapor", color: "#ffb74d", image: "images/monster-vapor/Peachansi.svg" },
    { id: 24, name: "Pinchezilla", flavor: "Ананас и личи", brand: "Monster Vapor", color: "#ffc107", image: "images/monster-vapor/Pinchezilla.svg" },
    { id: 25, name: "Snakelon", flavor: "Дыня и арбуз (ледяной)", brand: "Monster Vapor", color: "#4caf50", image: "images/monster-vapor/Snakelon.svg" },
    { id: 26, name: "Straw Fogler", flavor: "Киви с клубникой", brand: "Monster Vapor", color: "#e91e63", image: "images/monster-vapor/Straw_Fogler.svg" },
    { id: 27, name: "Straw Gona", flavor: "Клубника и банан", brand: "Monster Vapor", color: "#f06292", image: "images/monster-vapor/Straw_Gona.svg" },
    { id: 28, name: "Strawberry Grape", flavor: "Виноград с малиной", brand: "Monster Vapor", color: "#ba68c8", image: "images/monster-vapor/Strawberry_Grape.svg" },
    { id: 29, name: "Tropirus", flavor: "Ананас, манго и клубника", brand: "Monster Vapor", color: "#ff5722", image: "images/monster-vapor/Tropirus.svg" },
    { id: 30, name: "Watercream", flavor: "Клубника со сливками", brand: "Monster Vapor", color: "#f48fb1", image: "images/monster-vapor/Watercream.svg" },
    { id: 31, name: "Apple Cranberry", flavor: "Яблоко с клюквой", brand: "Monster Vapor", color: "#e53935", image: "images/monster-vapor/Apple_Cranberry.svg" },
    { id: 32, name: "Hypnocrank", flavor: "Малина с клюквой", brand: "Monster Vapor", color: "#ad1457", image: "images/monster-vapor/Hypnocrank.svg" },
    { id: 33, name: "Catrula", flavor: "Травяные ноты со сладкой ягодой", brand: "Monster Vapor", color: "#66bb6a", image: "images/monster-vapor/Catrula.svg" },
    { id: 34, name: "Strawnergy Things", flavor: "Клубника", brand: "Monster Vapor", color: "#ec407a", image: "images/monster-vapor/Strawnergy_Things.svg" }
];

// Доступные эмодзи для выбора
const availableEmojis = ["🍯", "⚠️", "🧼", "🌪", "💎"];

/**
 * Создаёт пустой объект карточки с данными по умолчанию
 * @param {Object} baseData - базовые данные (name, flavor, brand)
 * @param {boolean} isOther - является ли карточкой из вкладки Other
 * @returns {Object} объект карточки
 */
function createEmptyCard(baseData, isOther = false) {
    return {
        id: baseData.id || Date.now(),
        name: baseData.name || "",
        flavor: baseData.flavor || "",
        brand: baseData.brand || (isOther ? "Custom" : "Monster Vapor"),
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
        isUserAdded: baseData.isUserAdded || false, // MV карточки, добавленные пользователем
        createdAt: new Date().toISOString()
    };
}

/**
 * Вычисляет средний рейтинг на основе оценок Саши и Насти
 * @param {number|null} ratingSasha 
 * @param {number|null} ratingNastya 
 * @returns {number|null} средний рейтинг или null
 */
function calculateAverageRating(ratingSasha, ratingNastya) {
    if (ratingSasha === null && ratingNastya === null) {
        return null;
    }
    if (ratingSasha === null) {
        return ratingNastya;
    }
    if (ratingNastya === null) {
        return ratingSasha;
    }
    return Math.round(((ratingSasha + ratingNastya) / 2) * 10) / 10;
}

/**
 * Инициализирует данные для Monster Vapor вкладок
 * @returns {Array} массив карточек
 */
function initializeMonsterVaporData() {
    return monsterVaporFlavors.map(flavor => createEmptyCard(flavor, false));
}

/**
 * Получает все вкусы Monster Vapor
 * @returns {Array} массив вкусов
 */
function getAllFlavors() {
    return monsterVaporFlavors;
}

// Экспорт для использования в других модулях
window.MonsterVaporData = {
    flavors: monsterVaporFlavors,
    availableEmojis,
    createEmptyCard,
    calculateAverageRating,
    initializeMonsterVaporData,
    getAllFlavors
};
