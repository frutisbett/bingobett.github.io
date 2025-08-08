// 🔧 Решение проблемы с кешем для Telegram Mini App
// Этот код предотвращает накопление кеша и обеспечивает всегда свежую версию

(function() {
    'use strict';
    
    // Генерация уникальной версии для каждой загрузки
    const CACHE_VERSION = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    // Функция для добавления версии к URL ресурсов
    function addCacheBuster(url) {
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
            if (link.href && !link.href.includes('telegram-web-app')) {
                link.href = addCacheBuster(link.href);
            }
        });
    }
    
    // Обновление всех JS файлов
    function updateScriptSources() {
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            if (script.src && !script.src.includes('telegram-web-app')) {
                script.src = addCacheBuster(script.src);
            }
        });
    }
    
    // Обновление изображений
    function updateImageSources() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src) {
                img.src = addCacheBuster(img.src);
            }
        });
    }
    
    // Очистка кеша при загрузке
    function clearCache() {
        // Очистка localStorage
        localStorage.removeItem('telegram_game_cache');
        sessionStorage.removeItem('telegram_game_cache');
        
        // Очистка браузерного кеша
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    caches.delete(cacheName);
                });
            });
        }
    }
    
    // Настройка заголовков для предотвращения кеширования
    function setupNoCacheHeaders() {
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
    
    // Инициализация при загрузке страницы
    function init() {
        console.log('🔄 Инициализация системы предотвращения кеша...');
        
        // Очищаем кеш при загрузке
        clearCache();
        
        // Настраиваем заголовки
        setupNoCacheHeaders();
        
        // Обновляем все ресурсы
        setTimeout(() => {
            updateCSSLinks();
            updateScriptSources();
            updateImageSources();
        }, 100);
        
        console.log('✅ Система предотвращения кеша активирована');
    }
    
    // Запускаем при загрузке
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Дополнительная функция для принудительной перезагрузки
    window.forceReload = function() {
        window.location.href = window.location.pathname + '?v=' + Date.now();
    };
    
    // Функция для очистки кеша вручную
    window.clearGameCache = function() {
        clearCache();
        console.log('✅ Кеш очищен');
    };
    
})();
