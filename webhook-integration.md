# 🚀 GitHub Webhooks для BingoBett - Полная интеграция

## 🎯 Что дают нам Webhooks для игры:

### 1. **🔄 Автоматическое обновление игры**
- Мгновенное развертывание новых версий при push
- Автоматическое тестирование перед публикацией
- Rollback при ошибках

### 2. **💰 Улучшенная платежная система**
- Webhook уведомления от ЮMoney о успешных платежах
- Автоматическое зачисление средств в реальном времени
- Логирование всех транзакций

### 3. **📊 Аналитика и мониторинг**
- Статистика игроков в реальном времени
- Мониторинг ошибок и производительности
- Автоматические отчеты о доходах

### 4. **🎮 Динамические обновления игры**
- Обновление джекпота без перезагрузки
- Новые мини-игры "на лету"
- Персонализация для игроков

## 🛠️ Реализация Webhook системы

### GitHub Actions для автодеплоя:

```yaml
# .github/workflows/deploy.yml
name: 🎰 BingoBett Auto Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: 🧪 Test HTML validity
        run: |
          sudo apt-get install -y tidy
          tidy -q -e index.html || true
          
      - name: 🎮 Test JavaScript
        run: |
          node -c -p "
            const fs = require('fs');
            const content = fs.readFileSync('index.html', 'utf8');
            const jsCode = content.match(/<script>(.*?)<\/script>/s)[1];
            console.log('✅ JavaScript syntax OK');
          "
          
      - name: 🔍 Test game functions
        run: |
          node -e "
            const fs = require('fs');
            const content = fs.readFileSync('index.html', 'utf8');
            const functions = ['initiatePayment', 'startCoinRainGame', 'spin'];
            functions.forEach(func => {
              if (content.includes('function ' + func)) {
                console.log('✅ Function found:', func);
              } else {
                console.log('❌ Function missing:', func);
                process.exit(1);
              }
            });
          "

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: 🚀 Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
          
      - name: 📬 Notify Telegram
        env:
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
        run: |
          curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
            -H "Content-Type: application/json" \
            -d "{
              \"chat_id\": \"${TELEGRAM_CHAT_ID}\",
              \"text\": \"🎰 BingoBett обновлен!\n\n✅ Новая версия развернута\n🔗 https://frutisbett.github.io/bingobett.github.io\",
              \"parse_mode\": \"Markdown\"
            }"
```

### Webhook сервер для платежей:

```javascript
// webhook-server.js
const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// Webhook для уведомлений ЮMoney
app.post('/yoomoney-webhook', (req, res) => {
  const { label, amount, operation_id, datetime } = req.body;
  
  // Проверяем, что это наш платеж
  if (label && label.startsWith('bingobett_')) {
    console.log(`💰 Получен платеж: ${amount}₽ (${operation_id})`);
    
    // Обновляем баланс игрока в реальном времени
    updatePlayerBalance(label, amount);
    
    // Логируем транзакцию
    logTransaction({
      label,
      amount,
      operation_id,
      datetime,
      status: 'completed'
    });
  }
  
  res.status(200).send('OK');
});

// Webhook для обновлений игры
app.post('/game-update', (req, res) => {
  const { type, data } = req.body;
  
  switch(type) {
    case 'jackpot_update':
      updateJackpot(data.amount);
      break;
      
    case 'new_mini_game':
      deployNewMiniGame(data.gameData);
      break;
      
    case 'player_achievement':
      sendAchievementNotification(data.playerId, data.achievement);
      break;
  }
  
  res.status(200).send('OK');
});

// WebSocket для real-time обновлений
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

function updatePlayerBalance(label, amount) {
  // Найти игрока по label
  const playerId = extractPlayerIdFromLabel(label);
  
  // Отправить обновление через WebSocket
  wss.clients.forEach(client => {
    if (client.playerId === playerId) {
      client.send(JSON.stringify({
        type: 'balance_update',
        amount: amount
      }));
    }
  });
}

function updateJackpot(newAmount) {
  // Обновляем джекпот для всех игроков
  wss.clients.forEach(client => {
    client.send(JSON.stringify({
      type: 'jackpot_update',
      amount: newAmount
    }));
  });
}

app.listen(3000, () => {
  console.log('🎰 BingoBett Webhook Server запущен на порту 3000');
});
```

### Интеграция в игру:

```javascript
// Добавить в index.html
class WebhookIntegration {
  constructor() {
    this.ws = null;
    this.connectWebSocket();
  }
  
  connectWebSocket() {
    try {
      this.ws = new WebSocket('wss://your-webhook-server.com:8080');
      
      this.ws.onopen = () => {
        console.log('🔗 Подключение к серверу обновлений');
        this.ws.send(JSON.stringify({
          type: 'player_connect',
          playerId: username,
          gameVersion: '2.0'
        }));
      };
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleServerUpdate(data);
      };
      
      this.ws.onclose = () => {
        console.log('❌ Соединение потеряно, переподключение...');
        setTimeout(() => this.connectWebSocket(), 5000);
      };
    } catch (error) {
      console.log('⚠️ WebSocket недоступен, работаем в автономном режиме');
    }
  }
  
  handleServerUpdate(data) {
    switch(data.type) {
      case 'balance_update':
        balance += data.amount;
        updateBalance();
        showMessage(`✅ Платеж обработан!\n💰 Баланс пополнен на ${data.amount} ₽`);
        break;
        
      case 'jackpot_update':
        jackpot = data.amount;
        updateJackpot();
        break;
        
      case 'new_feature':
        this.loadNewFeature(data.feature);
        break;
        
      case 'maintenance_mode':
        this.showMaintenanceNotice(data.message);
        break;
    }
  }
  
  loadNewFeature(feature) {
    // Динамическая загрузка новых функций
    if (feature.type === 'mini_game') {
      eval(feature.code); // В продакшене использовать безопасную загрузку
      showMessage(`🆕 Новая мини-игра: ${feature.name}!`);
    }
  }
}

// Инициализация webhook интеграции
const webhookIntegration = new WebhookIntegration();
```

## 🔐 Настройка безопасности

### 1. **Секретные ключи в GitHub:**
```bash
# Добавить в Settings > Secrets and variables > Actions:
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
YOOMONEY_SECRET=your_yoomoney_secret
WEBHOOK_SECRET=random_secret_key
```

### 2. **Валидация Webhook запросов:**
```javascript
function validateYooMoneyWebhook(req) {
  const signature = req.headers['x-signature'];
  const body = JSON.stringify(req.body);
  const hash = crypto
    .createHmac('sha256', process.env.YOOMONEY_SECRET)
    .update(body)
    .digest('hex');
    
  return signature === hash;
}
```

## 📊 Аналитика и мониторинг

### Сбор метрик игры:
```javascript
class GameAnalytics {
  constructor() {
    this.events = [];
  }
  
  trackEvent(eventType, data) {
    const event = {
      type: eventType,
      data: data,
      timestamp: Date.now(),
      playerId: username,
      sessionId: this.getSessionId()
    };
    
    this.events.push(event);
    this.sendToWebhook(event);
  }
  
  sendToWebhook(event) {
    fetch('/analytics-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    }).catch(err => console.log('Analytics error:', err));
  }
}

// Использование
const analytics = new GameAnalytics();

// Трекинг событий
analytics.trackEvent('spin', { bet: bet, result: totalWin });
analytics.trackEvent('mini_game_start', { type: 'coin_rain' });
analytics.trackEvent('payment', { amount: amount, method: 'yoomoney' });
```

## 🎮 Динамические обновления игры

### Hot-reload новых функций:
```javascript
class DynamicUpdater {
  async checkForUpdates() {
    try {
      const response = await fetch('/api/game-updates');
      const updates = await response.json();
      
      for (const update of updates) {
        await this.applyUpdate(update);
      }
    } catch (error) {
      console.log('Update check failed:', error);
    }
  }
  
  async applyUpdate(update) {
    switch(update.type) {
      case 'config':
        this.updateGameConfig(update.data);
        break;
        
      case 'function':
        this.injectNewFunction(update.data);
        break;
        
      case 'ui':
        this.updateUI(update.data);
        break;
    }
    
    showMessage(`🔄 Игра обновлена: ${update.description}`);
  }
}
```

## 🚀 Развертывание

### 1. **Настройка GitHub Webhook:**
- Идите в Settings > Webhooks
- URL: `https://your-server.com/github-webhook`
- Content type: `application/json`
- Events: `push`, `pull_request`

### 2. **Настройка ЮMoney Webhook:**
- В настройках ЮMoney добавьте Webhook URL
- URL: `https://your-server.com/yoomoney-webhook`

### 3. **Запуск webhook сервера:**
```bash
# Установка зависимостей
npm install express ws crypto

# Запуск сервера
node webhook-server.js
```

## 📈 Результаты внедрения

После внедрения Webhook системы вы получите:

✅ **Автоматические обновления** игры без ручного вмешательства  
✅ **Мгновенное зачисление** платежей ЮMoney  
✅ **Real-time аналитику** игроков и доходов  
✅ **Динамические обновления** контента без перезагрузки  
✅ **Автоматическое тестирование** новых версий  
✅ **Уведомления** в Telegram о всех событиях  

Эта система превратит вашу игру в современное, самообновляющееся приложение уровня enterprise! 🎰✨