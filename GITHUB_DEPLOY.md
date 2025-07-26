# 🚀 Развертывание BingoBett на GitHub Pages

## 📋 Пошаговая инструкция

### 1️⃣ Создание репозитория на GitHub

1. **Перейдите на [GitHub.com](https://github.com)**
2. **Нажмите "New repository" (зеленая кнопка)**
3. **Заполните данные:**
   - **Repository name:** `bingobett-telegram-miniapp`
   - **Description:** `🎰 BingoBett - Telegram Mini App slot machine game`
   - **Visibility:** ✅ Public (обязательно для GitHub Pages)
   - **Initialize:** ✅ Add a README file
   - **License:** MIT License

4. **Нажмите "Create repository"**

### 2️⃣ Загрузка файлов

#### Способ A: Через веб-интерфейс GitHub

1. **В созданном репозитории нажмите "uploading an existing file"**
2. **Перетащите все файлы из папки проекта:**
   ```
   📁 docs/
   ├── 📄 index.html
   ├── 📄 game.html
   └── 📄 _config.yml
   📁 .github/workflows/
   └── 📄 deploy.yml
   📄 README.md
   📄 package.json
   📄 LICENSE
   📄 .gitignore
   📄 TELEGRAM_SETUP.md
   ```

3. **Добавьте commit message:** `🎰 Initial commit: BingoBett Telegram Mini App`
4. **Нажмите "Commit changes"**

#### Способ B: Через Git командную строку

```bash
# Клонируйте репозиторий
git clone https://github.com/YOURUSERNAME/bingobett-telegram-miniapp.git
cd bingobett-telegram-miniapp

# Скопируйте все файлы проекта в эту папку
# Затем добавьте и зафиксируйте изменения
git add .
git commit -m "🎰 Initial commit: BingoBett Telegram Mini App"
git push origin main
```

### 3️⃣ Настройка GitHub Pages

1. **В репозитории перейдите в Settings**
2. **В левом меню найдите "Pages"**
3. **В разделе "Source" выберите:**
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` (или `master`)
   - **Folder:** `/docs`

4. **Нажмите "Save"**

### 4️⃣ Проверка развертывания

1. **GitHub начнет автоматическое развертывание**
2. **Проверить статус можно во вкладке "Actions"**
3. **После завершения игра будет доступна по адресу:**
   ```
   https://YOURUSERNAME.github.io/bingobett-telegram-miniapp/
   ```

### 5️⃣ URL для Telegram Mini App

**Основной URL игры для BotFather:**
```
https://YOURUSERNAME.github.io/bingobett-telegram-miniapp/game.html
```

## 🤖 Настройка Telegram бота

### Создание бота через @BotFather

1. **Откройте Telegram и найдите @BotFather**
2. **Отправьте команду:** `/newbot`
3. **Введите название:** `BingoBett Game`
4. **Введите username:** `your_unique_name_bot`
5. **Сохраните токен бота!**

### Настройка Mini App

1. **Отправьте команду:** `/newapp`
2. **Выберите вашего бота**
3. **Заполните данные:**
   - **Title:** `🎰 BingoBett`
   - **Description:** `Увлекательная слот-машина с джекпотами и мини-играми!`
   - **Photo:** Загрузите изображение 640×360px
   - **Web App URL:** `https://YOURUSERNAME.github.io/bingobett-telegram-miniapp/game.html`

### Дополнительные настройки

1. **Команды бота:**
   ```
   /setcommands
   start - 🎰 Запустить игру
   help - ❓ Помощь и правила
   stats - 📊 Статистика
   ```

2. **Кнопка меню:**
   ```
   /setmenubutton
   URL: https://YOURUSERNAME.github.io/bingobett-telegram-miniapp/game.html
   Text: 🎰 Играть в BingoBett
   ```

3. **Описание бота:**
   ```
   /setdescription
   🎰 BingoBett - профессиональная слот-машина!
   
   ✨ 55 фриспинов для новых игроков
   🏆 Прогрессивный джекпот
   🎲 Увлекательные мини-игры
   💰 Реальные выигрыши
   
   Нажми "Играть" и испытай удачу!
   ```

## 🔧 Обновление игры

### Автоматическое развертывание

При каждом обновлении файлов в репозитории GitHub автоматически пересоберет и разместит новую версию.

### Ручное обновление

1. **Измените файлы в папке `docs/`**
2. **Сделайте commit и push:**
   ```bash
   git add .
   git commit -m "🔄 Update game"
   git push origin main
   ```
3. **GitHub Pages автоматически обновится через 1-5 минут**

## 📊 Мониторинг

### GitHub Actions

- **Статус развертывания:** `https://github.com/YOURUSERNAME/bingobett-telegram-miniapp/actions`
- **Логи сборки:** Доступны в разделе Actions

### Проверка работоспособности

```bash
# Проверка доступности игры
curl -I https://YOURUSERNAME.github.io/bingobett-telegram-miniapp/game.html

# Ожидаемый ответ: HTTP/2 200
```

## 🛡️ Безопасность

### HTTPS

- ✅ **GitHub Pages автоматически предоставляет HTTPS**
- ✅ **Обязательно для Telegram Mini Apps**

### Домен

- **По умолчанию:** `yourusername.github.io/repository-name`
- **Кастомный домен:** Можно настроить в Settings → Pages

## 🚨 Устранение неполадок

### Проблема: Игра не загружается

**Решения:**
1. Проверьте, что репозиторий публичный
2. Убедитесь, что GitHub Pages включены
3. Проверьте, что файлы находятся в папке `docs/`
4. Дождитесь завершения развертывания (1-10 минут)

### Проблема: 404 ошибка

**Решения:**
1. Проверьте правильность URL
2. Убедитесь, что файл `game.html` существует в папке `docs/`
3. Проверьте настройки GitHub Pages

### Проблема: Telegram не открывает игру

**Решения:**
1. Убедитесь, что URL использует HTTPS
2. Проверьте, что игра доступна в браузере
3. Убедитесь, что URL правильно настроен в BotFather

## ✅ Чек-лист готовности

- [ ] Репозиторий создан на GitHub
- [ ] Файлы загружены в папку `docs/`
- [ ] GitHub Pages настроены и активированы
- [ ] Игра доступна по HTTPS URL
- [ ] Telegram бот создан через @BotFather
- [ ] Mini App настроен с правильным URL
- [ ] Бот протестирован в Telegram

## 🎉 Готово!

После выполнения всех шагов ваша игра будет доступна:

- **🌐 В браузере:** `https://yourusername.github.io/bingobett-telegram-miniapp/`
- **📱 В Telegram:** Через вашего бота
- **🔄 Автообновления:** При каждом push в репозиторий

**Удачного запуска! 🎰🚀**