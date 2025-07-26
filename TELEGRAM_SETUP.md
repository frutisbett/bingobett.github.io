# 🚀 Настройка BingoBett для Telegram Mini App

## 📋 Пошаговая инструкция

### 1️⃣ Подготовка файлов

Убедитесь, что у вас есть файл `telegram-webapp.html` - это специальная версия игры для Telegram Mini App.

### 2️⃣ Создание Telegram бота

1. **Откройте Telegram и найдите @BotFather**
2. **Создайте нового бота:**
   ```
   /newbot
   ```
   - Введите название бота: `BingoBett Game`
   - Введите username: `your_unique_bingobett_bot` (должен заканчиваться на `bot`)

3. **Сохраните токен бота** - он понадобится для backend интеграции

### 3️⃣ Размещение файлов на сервере

#### Вариант A: GitHub Pages (бесплатно)

1. **Создайте репозиторий на GitHub:**
   - Название: `bingobett-telegram-miniapp`
   - Сделайте репозиторий публичным

2. **Загрузите файлы:**
   ```bash
   git clone https://github.com/yourusername/bingobett-telegram-miniapp.git
   cd bingobett-telegram-miniapp
   
   # Скопируйте все файлы проекта
   cp telegram-webapp.html index.html demo.html ./
   cp README.md package.json LICENSE .gitignore ./
   
   git add .
   git commit -m "🎰 Initial commit: BingoBett Telegram Mini App"
   git push origin main
   ```

3. **Включите GitHub Pages:**
   - Перейдите в Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "main" / "master"
   - Folder: "/ (root)"
   - Сохраните

4. **Ваша игра будет доступна по адресу:**
   ```
   https://yourusername.github.io/bingobett-telegram-miniapp/telegram-webapp.html
   ```

#### Вариант B: Собственный сервер

1. **Требования:**
   - Веб-сервер (Apache, Nginx, или любой другой)
   - **ОБЯЗАТЕЛЬНО HTTPS** (Telegram Mini Apps работают только с HTTPS)
   - SSL сертификат

2. **Загрузите файл:**
   ```bash
   # Загрузите telegram-webapp.html на ваш сервер
   scp telegram-webapp.html user@yourserver.com:/var/www/html/
   ```

3. **Проверьте доступность:**
   ```
   https://yourserver.com/telegram-webapp.html
   ```

### 4️⃣ Настройка Mini App в BotFather

1. **Создайте Web App:**
   ```
   /newapp
   ```
   - Выберите вашего бота
   - **Название:** `BingoBett`
   - **Описание:** `🎰 Увлекательная слот-машина с джекпотами и мини-играми!`
   - **Загрузите изображение:** размер 640×360 пикселей
   - **Web App URL:** ваша HTTPS ссылка на `telegram-webapp.html`

2. **Настройте команды бота:**
   ```
   /setcommands
   ```
   Вставьте:
   ```
   start - 🎰 Запустить игру
   help - ❓ Помощь и правила
   stats - 📊 Статистика игры
   ```

3. **Настройте кнопку меню:**
   ```
   /setmenubutton
   ```
   - **URL:** ваша ссылка на `telegram-webapp.html`
   - **Text:** `🎰 Играть в BingoBett`

4. **Настройте описание бота:**
   ```
   /setdescription
   ```
   ```
   🎰 BingoBett - профессиональная слот-машина!
   
   ✨ 55 фриспинов для новых игроков
   🏆 Прогрессивный джекпот
   🎲 Увлекательные мини-игры
   💰 Реальные выигрыши
   
   Нажми "Играть" и испытай удачу!
   ```

### 5️⃣ Тестирование

1. **Найдите вашего бота в Telegram**
2. **Отправьте команду `/start`**
3. **Нажмите кнопку "🎰 Играть в BingoBett"**
4. **Проверьте, что игра загружается корректно**

### 6️⃣ Backend интеграция (опционально)

Для полной функциональности создайте backend сервер:

#### Обработка данных от игры

```python
# Пример на Python (Flask)
from flask import Flask, request, jsonify
import json

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def handle_telegram_data():
    data = request.json
    
    if data.get('action') == 'payment':
        # Обработка платежа
        amount = data.get('amount')
        user_id = data.get('user_id')
        # Здесь интеграция с платежной системой
        return jsonify({'status': 'success'})
    
    elif data.get('action') == 'withdraw':
        # Обработка вывода
        amount = data.get('amount')
        card = data.get('card')
        user_id = data.get('user_id')
        # Здесь логика вывода средств
        return jsonify({'status': 'success'})
    
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

#### Node.js версия

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
    const { action, amount, user_id, card } = req.body;
    
    switch(action) {
        case 'payment':
            // Обработка платежа
            console.log(`Payment request: ${amount} from user ${user_id}`);
            break;
            
        case 'withdraw':
            // Обработка вывода
            console.log(`Withdraw request: ${amount} to card ${card} from user ${user_id}`);
            break;
            
        case 'game_loaded':
            // Аналитика загрузки игры
            console.log(`Game loaded by user ${user_id}`);
            break;
    }
    
    res.json({ status: 'success' });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

### 7️⃣ Настройка платежей

#### Вариант A: Telegram Payments

```python
import telegram
from telegram import LabeledPrice

# Создание инвойса
def create_invoice(update, context):
    chat_id = update.effective_chat.id
    title = "Пополнение BingoBett"
    description = "Пополнение игрового баланса"
    payload = "bingobett-topup"
    provider_token = "YOUR_PAYMENT_PROVIDER_TOKEN"
    currency = "RUB"
    prices = [LabeledPrice("Пополнение", amount * 100)]  # в копейках
    
    context.bot.send_invoice(
        chat_id, title, description, payload,
        provider_token, currency, prices
    )
```

#### Вариант B: Внешние платежные системы

- **ЮMoney (Яндекс.Деньги)**
- **Сбербанк Эквайринг**
- **Tinkoff Acquiring**
- **PayPal** (для международных платежей)

### 8️⃣ Мониторинг и аналитика

```javascript
// Отправка событий в аналитику
function trackEvent(action, data) {
    if (tg) {
        tg.sendData(JSON.stringify({
            action: action,
            data: data,
            timestamp: Date.now(),
            user_id: tgUser?.id
        }));
    }
}

// Примеры событий
trackEvent('game_started', { bet_amount: betAmount });
trackEvent('spin_completed', { win_amount: totalWin });
trackEvent('jackpot_won', { amount: jackpot });
```

### 9️⃣ Безопасность

1. **Проверка подписи данных:**
```python
import hmac
import hashlib

def verify_telegram_data(data, bot_token):
    # Проверка подписи данных от Telegram
    check_hash = data.pop('hash', '')
    data_check_string = '\n'.join([f"{k}={v}" for k, v in sorted(data.items())])
    secret_key = hashlib.sha256(bot_token.encode()).digest()
    expected_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(check_hash, expected_hash)
```

2. **Rate limiting:**
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["100 per hour"]
)

@app.route('/api/spin')
@limiter.limit("10 per minute")
def spin():
    # Ограничение на количество спинов
    pass
```

### 🔧 Устранение неполадок

#### Проблема: Игра не загружается

**Решения:**
1. Проверьте, что URL использует HTTPS
2. Убедитесь, что файл доступен по прямой ссылке
3. Проверьте CORS заголовки сервера

#### Проблема: Не работает главная кнопка

**Решения:**
1. Проверьте инициализацию SDK: `tg.ready()`
2. Убедитесь, что вызывается `tg.expand()`
3. Проверьте консоль браузера на ошибки

#### Проблема: Не получаются данные пользователя

**Решения:**
1. Проверьте `tg.initDataUnsafe`
2. Убедитесь, что бот имеет доступ к пользовательским данным
3. Проверьте настройки приватности пользователя

### 📱 Тестирование на разных устройствах

1. **Android:**
   - Telegram версии 8.0+
   - Chrome WebView 80+

2. **iOS:**
   - Telegram версии 8.0+
   - Safari WebKit

3. **Desktop:**
   - Telegram Desktop
   - Telegram Web

### 🚀 Запуск в продакшн

1. **Проверьте производительность:**
   ```bash
   # Lighthouse audit
   npm install -g lighthouse
   lighthouse https://yoursite.com/telegram-webapp.html --chrome-flags="--headless"
   ```

2. **Настройте мониторинг:**
   - Логирование ошибок
   - Метрики производительности
   - Аналитика пользователей

3. **Backup и восстановление:**
   - Регулярные бэкапы данных
   - Мониторинг доступности
   - План восстановления

---

## ✅ Чек-лист готовности

- [ ] Бот создан в BotFather
- [ ] Файл `telegram-webapp.html` размещен на HTTPS сервере
- [ ] Web App настроен в BotFather
- [ ] Команды бота настроены
- [ ] Кнопка меню создана
- [ ] Игра тестируется в Telegram
- [ ] Backend для платежей настроен (опционально)
- [ ] Мониторинг и аналитика включены
- [ ] Безопасность проверена

**🎉 Поздравляем! Ваша Telegram Mini App готова к запуску!**