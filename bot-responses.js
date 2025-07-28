// 🤖 Обработчик команд для Telegram Mini App Bot
// Этот файл показывает, как должен отвечать бот на команды

const BOT_TOKEN = '8019563361:AAGgj70UNEPLLQi1kL-pBwGXD_3VmMHM8mA';
const MINI_APP_URL = 'https://frutisbett.github.io/bingobett.github.io/welcome.html';

// 📱 Ответы на команды
const responses = {
    '/start': {
        text: `🎰 *Добро пожаловать в BingoBett!*

🏆 *Жми на старт и врывайся в лигу победителей!*

🚀 Нажмите кнопку ниже чтобы запустить игру:`,
        reply_markup: {
            inline_keyboard: [[
                {
                    text: "🎰 ИГРАТЬ В BINGOBETT",
                    web_app: { url: MINI_APP_URL }
                }
            ]]
        },
        parse_mode: 'Markdown'
    },

    '/play': {
        text: `🎮 *Готов играть в BingoBett?*

✨ Реальные выигрыши через ЮMoney
🌧️ Мини-игра "Дождь монет"  
🎁 55 бесплатных спинов ежедневно
💎 Уникальный золотой дизайн

🚀 Запускайте игру:`,
        reply_markup: {
            inline_keyboard: [[
                {
                    text: "🚀 НАЧАТЬ ИГРУ",
                    web_app: { url: MINI_APP_URL }
                }
            ]]
        },
        parse_mode: 'Markdown'
    },

    '/help': {
        text: `❓ *Помощь по BingoBett*

🎯 *Как играть:*
• Нажмите кнопку "Играть" 
• Крутите барабаны
• Выигрывайте реальные деньги
• Выводите через ЮMoney

🎮 *Мини-игры:*
• 🌧️ Дождь монет (33% шанс)
• 📦 Выбери коробку (33% шанс)

💰 *Выплаты:*
• Минимальный вывод: 40,001 ₽
• Через ЮMoney кошелек
• Мгновенные переводы

🚀 Начать играть:`,
        reply_markup: {
            inline_keyboard: [[
                {
                    text: "🎰 ЗАПУСТИТЬ ИГРУ",
                    web_app: { url: MINI_APP_URL }
                }
            ]]
        },
        parse_mode: 'Markdown'
    }
};

// 🔄 Функция отправки сообщения
async function sendMessage(chatId, messageData) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const payload = {
        chat_id: chatId,
        ...messageData
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        return await response.json();
    } catch (error) {
        console.error('Error sending message:', error);
        return null;
    }
}

// 📥 Обработчик входящих сообщений
function handleUpdate(update) {
    if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text;

        // Обработка команд
        if (responses[text]) {
            sendMessage(chatId, responses[text]);
        } else {
            // Дефолтный ответ для неизвестных команд
            sendMessage(chatId, {
                text: `🎰 Привет! Используйте команды:
/start - Запустить BingoBett
/play - Играть в слоты  
/help - Получить помощь

Или просто нажмите кнопку ниже:`,
                reply_markup: {
                    inline_keyboard: [[
                        {
                            text: "🚀 ИГРАТЬ",
                            web_app: { url: MINI_APP_URL }
                        }
                    ]]
                }
            });
        }
    }
}

// 🌐 Экспорт для использования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        responses,
        sendMessage,
        handleUpdate,
        BOT_TOKEN,
        MINI_APP_URL
    };
}

console.log('🤖 Bot responses configured for Mini App mode');