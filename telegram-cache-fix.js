// 🔧 Улучшенное решение проблемы с кешем для Telegram Mini App
// Этот код предотвращает накопление кеша и обеспечивает всегда свежую версию

(function() {
    'use strict';
    
    console.log('🔄 Запуск системы предотвращения кеша для Telegram...');
    
    // Генерация уникальной версии для каждой загрузки
    const CACHE_VERSION = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const TELEGRAM_DOMAINS = ['telegram.org', 't.me', 'telegram-web-app'];
    
    // Проверяем, запущено ли в Telegram Web App
    const isTelegramApp = window.Telegram && window.Telegram.WebApp;
    
    // Функция для добавления версии к URL ресурсов
    function addCacheBuster(url) {
        if (!url) return url;
        
        // Не добавляем версию к Telegram ресурсам
        const isTelegramResource = TELEGRAM_DOMAINS.some(domain => url.includes(domain));
        if (isTelegramResource) return url;
        
        if (url.includes('?')) {
            return url + '&v=' + CACHE_VERSION;
        } else {
            return url + '?v=' + CACHE_VERSION;
        }
    }
    
    // Обновление всех CSS файлов
    function updateCSSLinks() {
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(link => {
            if (link.href) {
                const newHref = addCacheBuster(link.href);
                if (newHref !== link.href) {
                    link.href = newHref;
                    console.log('🔄 Обновлен CSS:', link.href);
                }
            }
        });
    }
    
    // Обновление всех JS файлов
    function updateScriptSources() {
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            if (script.src) {
                const newSrc = addCacheBuster(script.src);
                if (newSrc !== script.src) {
                    script.src = newSrc;
                    console.log('🔄 Обновлен JS:', script.src);
                }
            }
        });
    }
    
    // Обновление изображений
    function updateImageSources() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src) {
                const newSrc = addCacheBuster(img.src);
                if (newSrc !== img.src) {
                    img.src = newSrc;
                    console.log('🔄 Обновлено изображение:', img.src);
                }
            }
        });
    }
    
    // Обновление фоновых изображений
    function updateBackgroundImages() {
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            const style = window.getComputedStyle(el);
            const bgImage = style.backgroundImage;
            
            if (bgImage && bgImage !== 'none' && bgImage.includes('url')) {
                const urlMatch = bgImage.match(/url\(["']?(.*?)["']?\)/);
                if (urlMatch && urlMatch[1]) {
                    const newUrl = addCacheBuster(urlMatch[1]);
                    if (newUrl !== urlMatch[1]) {
                        el.style.backgroundImage = `url("${newUrl}")`;
                        console.log('🔄 Обновлено фоновое изображение:', newUrl);
                    }
                }
            }
        });
    }
    
    // Очистка кеша при загрузке
    function clearCache() {
        console.log('🧹 Очистка кеша...');
        
        // Очистка localStorage
        const keysToKeep = ['telegram_user_data', 'game_settings', 'user_preferences'];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!keysToKeep.includes(key)) {
                localStorage.removeItem(key);
            }
        }
        
        // Очистка sessionStorage
        sessionStorage.clear();
        
        // Очистка браузерного кеша
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    if (!cacheName.includes('telegram')) {
                        caches.delete(cacheName);
                        console.log('🗑️ Удален кеш:', cacheName);
                    }
                });
            }).catch(err => {
                console.log('⚠️ Ошибка очистки кеша:', err);
            });
        }
    }
    
    // Настройка заголовков для предотвращения кеширования
    function setupNoCacheHeaders() {
        console.log('📋 Настройка заголовков no-cache...');
        
        // Добавляем мета-теги для предотвращения кеширования
        const metaTags = [
            { name: 'cache-control', content: 'no-cache, no-store, must-revalidate' },
            { name: 'pragma', content: 'no-cache' },
            { name: 'expires', content: '0' }
        ];
        
        metaTags.forEach(tag => {
            const meta = document.createElement('meta');
            meta.name = tag.name;
            meta.content = tag.content;
            document.head.appendChild(meta);
        });
    }
    
    // Принудительное обновление страницы при обнаружении старой версии
    function checkForStaleCache() {
        const lastLoadTime = localStorage.getItem('last_load_time');
        const currentTime = Date.now();
        
        if (lastLoadTime && (currentTime - parseInt(lastLoadTime)) > 3600000) { // 1 час
            console.log('🔄 Обнаружен старый кеш, принудительная перезагрузка...');
            forceReload();
        }
        
        localStorage.setItem('last_load_time', currentTime.toString());
    }
    
    // Инициализация при загрузке страницы
    function init() {
        console.log('🚀 Инициализация системы предотвращения кеша...');
        
        // Проверяем на старый кеш
        checkForStaleCache();
        
        // Очищаем кеш при загрузке
        clearCache();
        
        // Настраиваем заголовки
        setupNoCacheHeaders();
        
        // Обновляем все ресурсы с задержкой для полной загрузки DOM
        setTimeout(() => {
            updateCSSLinks();
            updateScriptSources();
            updateImageSources();
            updateBackgroundImages();
        }, 500);
        
        console.log('✅ Система предотвращения кеша активирована');
        console.log('📊 Версия кеша:', CACHE_VERSION);
    }
    
    // Запускаем при загрузке
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100); // Даем время на инициализацию других скриптов
    }
    
    // Дополнительная функция для принудительной перезагрузки
    window.forceReload = function() {
        console.log('🔄 Принудительная перезагрузка...');
        window.location.href = window.location.pathname + '?v=' + Date.now();
    };
    
    // Функция для очистки кеша вручную
    window.clearGameCache = function() {
        clearCache();
        console.log('✅ Кеш очищен вручную');
    };
    
    // Экспортируем функции для использования в других скриптах
    window.TelegramCacheFix = {
        forceReload: window.forceReload,
        clearCache: window.clearGameCache,
        getCacheVersion: () => CACHE_VERSION
    };
    
})();
