# 🤖 Настройка Telegram бота для BingoBett

## 📋 Ваши данные:
- **Bot Token:** `7686465885:AAHYpW0wfTKtjUTGTS6IOIq1eY8XhFm8L2g`
- **Game URL:** `https://frutisbett.github.io/bingobett.github.io`
- **Bot Username:** (нужно узнать через @BotFather)

## 🔧 Пошаговая настройка:

### ШАГ 1: Настройка через BotFather

1. **Откройте @BotFather в Telegram**

2. **Введите команду:**
   ```
   /mybots
   ```

3. **Выберите вашего бота** (с токеном 7686465885)

4. **Выберите "Bot Settings"**

5. **Выберите "Menu Button"**

6. **Введите URL игры:**
   ```
   https://frutisbett.github.io/bingobett.github.io
   ```

7. **Введите текст кнопки:**
   ```
   🎰 Играть в BingoBett
   ```

### ШАГ 2: Настройка Web App

1. **В меню бота выберите "Web App"**

2. **Введите URL:**
   ```
   https://frutisbett.github.io/bingobett.github.io
   ```

3. **Подтвердите настройки**

### ШАГ 3: Настройка команд бота

1. **Введите команду в BotFather:**
   ```
   /setcommands
   ```

2. **Выберите вашего бота**

3. **Введите список команд:**
   ```
   start - 🎰 Запустить игру BingoBett
   play - 🎮 Играть в слоты
   rules - 📋 Правила игры
   help - ❓ Помощь
   ```

### ШАГ 4: Настройка описания

1. **Установите описание бота:**
   ```
   /setdescription
   ```

2. **Введите описание:**
   ```
   🎰 BingoBett - Игровые слоты с выводом денег!
   
   💰 Реальные выигрыши через ЮMoney
   🎮 Мини-игры "Дождь монет" и "Выбери коробку"
   🎁 55 бесплатных спинов каждый день
   💳 Минимальный вывод от 40,001 ₽
   
   Нажмите "Играть" чтобы начать!
   ```

### ШАГ 5: Настройка короткого описания

1. **Команда:**
   ```
   /setabouttext
   ```

2. **Короткое описание:**
   ```
   🎰 Игровые слоты с реальными выигрышами! Играйте и выводите деньги через ЮMoney.
   ```

## 🎮 Альтернативный способ - создание команд

### Код для обработки команд (если нужен серверный бот):

```python
import telebot
from telebot import types

bot = telebot.TeleBot('7686465885:AAHYpW0wfTKtjUTGTS6IOIq1eY8XhFm8L2g')

@bot.message_handler(commands=['start', 'play'])
def start_game(message):
    markup = types.InlineKeyboardMarkup()
    web_app = types.WebAppInfo("https://frutisbett.github.io/bingobett.github.io")
    markup.add(types.InlineKeyboardButton("🎰 Играть в BingoBett", web_app=web_app))
    
    bot.reply_to(message, 
        "🎰 *Добро пожаловать в BingoBett!*\n\n"
        "💰 Игровые слоты с реальными выигрышами\n"
        "🎮 Мини-игры и бонусы\n"
        "💳 Вывод через ЮMoney\n\n"
        "Нажмите кнопку ниже чтобы начать играть:",
        parse_mode='Markdown',
        reply_markup=markup)

@bot.message_handler(commands=['rules'])
def show_rules(message):
    rules_text = """
📋 *Правила BingoBett*

🎰 *Игра:* Слот-машина 5×4
🎯 *Линии:* 6 выигрышных линий
💰 *Ставки:* от 10 до 80 рублей
🎁 *Фриспины:* 55 в день

🎲 *Мини-игры:*
• "Выбери коробку" - выберите приз
• "Дождь монет" - ловите монеты
• Шанс: 33% (каждые 3-4 спина)

💳 *Вывод:* от 40,001 ₽ через ЮMoney
"""
    
    markup = types.InlineKeyboardMarkup()
    web_app = types.WebAppInfo("https://frutisbett.github.io/bingobett.github.io")
    markup.add(types.InlineKeyboardButton("🎰 Играть", web_app=web_app))
    
    bot.reply_to(message, rules_text, parse_mode='Markdown', reply_markup=markup)

@bot.message_handler(commands=['help'])
def show_help(message):
    help_text = """
❓ *Помощь по BingoBett*

🎮 *Как играть:*
1. Нажмите "🎰 Играть"
2. Установите ставку (10-80₽)
3. Нажмите "Крутить"
4. Ловите выигрыши!

💰 *Пополнение:*
• Нажмите кнопки 50₽, 300₽, 500₽, 800₽
• Оплата через ЮMoney
• Баланс пополняется автоматически

🎁 *Мини-игры:*
• Появляются каждые 3-4 спина
• Дают дополнительные выигрыши
• "Дождь монет" - тапайте по экрану

💳 *Вывод средств:*
• Минимум: 40,001₽
• На карту через форму в игре
• Обработка: 24 часа
"""
    
    markup = types.InlineKeyboardMarkup()
    web_app = types.WebAppInfo("https://frutisbett.github.io/bingobett.github.io")
    markup.add(types.InlineKeyboardButton("🎰 Играть", web_app=web_app))
    
    bot.reply_to(message, help_text, parse_mode='Markdown', reply_markup=markup)

if __name__ == '__main__':
    bot.polling()
```

## 🔗 Готовые команды для BotFather:

### Скопируйте и вставьте в @BotFather:

**1. Установка Menu Button:**
```
/setmenubutton
[выберите вашего бота]
https://frutisbett.github.io/bingobett.github.io
```

**2. Установка команд:**
```
/setcommands
[выберите вашего бота]
start - 🎰 Запустить игру BingoBett
play - 🎮 Играть в слоты  
rules - 📋 Правила игры
help - ❓ Помощь
```

**3. Установка описания:**
```
/setdescription
[выберите вашего бота]
🎰 BingoBett - Игровые слоты с выводом денег!

💰 Реальные выигрыши через ЮMoney
🎮 Мини-игры "Дождь монет" и "Выбери коробку"  
🎁 55 бесплатных спинов каждый день
💳 Минимальный вывод от 40,001 ₽

Нажмите "Играть" чтобы начать!
```

## 🎯 Результат:

После настройки:
1. **Пользователи откроют бота** → увидят кнопку "🎰 Играть в BingoBett"
2. **Нажмут на кнопку** → откроется ваша игра в Telegram Mini App
3. **Команда /start** → покажет приветствие с кнопкой игры
4. **Команда /rules** → покажет правила с кнопкой игры

## ⚡ Быстрая настройка:

1. Откройте @BotFather
2. Введите `/mybots`
3. Выберите вашего бота (7686465885)
4. Выберите "Edit Bot" → "Edit Buttons" → "Configure Menu Button"  
5. Введите URL: `https://frutisbett.github.io/bingobett.github.io`
6. Введите текст: `🎰 Играть в BingoBett`
7. Готово!

Теперь при открытии бота пользователи сразу увидят кнопку для запуска игры!