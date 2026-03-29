// Supabase конфигурация
const SUPABASE_URL = 'https://ajihwuotwwogahsgqdnv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_clt5vZsr3RJRP4sf5frMCw_GFf6rx6i';

// Инициализация клиента Supabase (используем window.supabase из библиотеки)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Вспомогательные функции для работы с базой данных

/**
 * Сохранить данные карточки в Supabase
 */
async function saveCardToSupabase(card) {
    try {
        const { data, error } = await supabaseClient
            .from('cards')
            .upsert({
                card_id: String(card.id),
                flavor: card.flavor || null,
                note: card.note || null,
                image: card.image || null,
                rating_sasha: card.ratingSasha,
                rating_nastya: card.ratingNastya,
                emojis: card.emojis || [],
                is_filled: card.isFilled || false,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'card_id'
            });
        
        if (error) throw error;
        console.log('✅ Card saved to Supabase:', card.id);
        return true;
    } catch (error) {
        console.error('❌ Error saving card:', error);
        return false;
    }
}

/**
 * Загрузить все данные из Supabase
 */
async function loadCardsFromSupabase() {
    try {
        const { data, error } = await supabaseClient
            .from('cards')
            .select('*');
        
        if (error) throw error;
        
        // Преобразуем данные в формат приложения
        const cards = data.map(row => {
            // Вычисляем средний рейтинг
            const avgRating = calculateAverageRating(row.rating_sasha, row.rating_nastya);
            
            return {
                id: row.card_id,
                name: '', // Название будет из data.js
                flavor: row.flavor,
                note: row.note,
                image: row.image,
                ratingSasha: row.rating_sasha,
                ratingNastya: row.rating_nastya,
                averageRating: avgRating,
                emojis: row.emojis || [],
                emojisSasha: row.emojis || [],
                emojisNastya: row.emojis || [],
                isFilled: row.is_filled,
                isOther: false
            };
        });
        
        console.log('✅ Loaded', cards.length, 'cards from Supabase');
        return cards;
    } catch (error) {
        console.error('❌ Error loading cards:', error);
        return [];
    }
}

/**
 * Вычисляет средний рейтинг
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
 * Синхронизировать локальные данные с Supabase
 */
async function syncWithSupabase(localCards) {
    // Загружаем данные из Supabase
    const remoteCards = await loadCardsFromSupabase();
    
    if (remoteCards.length === 0) {
        // Если в базе пусто, сохраняем локальные данные
        for (const card of localCards) {
            if (card.isFilled) {
                await saveCardToSupabase(card);
            }
        }
        return localCards;
    }
    
    // Если в базе есть данные, используем их
    return remoteCards;
}
