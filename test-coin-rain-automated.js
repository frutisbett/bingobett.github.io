#!/usr/bin/env node

/**
 * Автоматизированный тест мини-игры "Дождь монет" для BingoBett
 * Проверяет корректность реализации и соответствие требованиям
 */

const fs = require('fs');
const path = require('path');

class CoinRainGameTester {
    constructor() {
        this.testResults = {
            startTime: new Date(),
            testsRun: 0,
            testsPassed: 0,
            testsFailed: 0,
            details: [],
            gameParameters: {},
            codeAnalysis: {}
        };
        
        console.log('💰 Автоматизированный тест мини-игры "Дождь монет"');
        console.log('=' .repeat(60));
    }

    async runAllTests() {
        try {
            console.log('🚀 Запуск полного тестирования...\n');

            // 1. Анализ кода
            await this.analyzeGameCode();
            
            // 2. Проверка структуры HTML
            await this.testHtmlStructure();
            
            // 3. Проверка CSS стилей
            await this.testCssStyles();
            
            // 4. Проверка JavaScript логики
            await this.testJavaScriptLogic();
            
            // 5. Проверка параметров игры
            await this.testGameParameters();
            
            // 6. Проверка интеграции
            await this.testIntegration();
            
            // 7. Генерация отчета
            this.generateFinalReport();

        } catch (error) {
            console.error('❌ Критическая ошибка тестирования:', error);
            process.exit(1);
        }
    }

    async analyzeGameCode() {
        this.log('📄 Анализ кода игры...', 'info');
        
        try {
            const indexPath = path.join(__dirname, 'index.html');
            if (!fs.existsSync(indexPath)) {
                throw new Error('Файл index.html не найден');
            }

            const htmlContent = fs.readFileSync(indexPath, 'utf8');
            this.testResults.codeAnalysis.fileSize = Math.round(htmlContent.length / 1024);
            
            // Поиск ключевых элементов
            const checks = [
                { name: 'HTML элемент coinRainOverlay', pattern: /id="coinRainOverlay"/g },
                { name: 'Canvas элемент', pattern: /id="coinRainCanvas"/g },
                { name: 'UI элементы дождя монет', pattern: /id="coinRainUI"/g },
                { name: 'Функция startCoinRainGame', pattern: /function startCoinRainGame/g },
                { name: 'Класс Coin', pattern: /class Coin \{/g },
                { name: 'CSS стили мини-игры', pattern: /#coinRainOverlay/g },
                { name: 'Параметр GAME_DURATION', pattern: /GAME_DURATION.*4000/g },
                { name: 'Параметр COIN_VALUE', pattern: /COIN_VALUE.*5/g },
                { name: 'Параметр MAX_TOTAL_VALUE', pattern: /MAX_TOTAL_VALUE.*800/g }
            ];

            for (const check of checks) {
                const matches = htmlContent.match(check.pattern);
                const found = matches && matches.length > 0;
                
                this.testResults.codeAnalysis[check.name] = found;
                this.runTest(check.name, found, found ? 'Найдено' : 'Не найдено');
            }

            this.log('✅ Анализ кода завершен', 'success');

        } catch (error) {
            this.runTest('Анализ кода', false, error.message);
        }
    }

    async testHtmlStructure() {
        this.log('🏗️ Проверка HTML структуры...', 'info');
        
        try {
            const indexPath = path.join(__dirname, 'index.html');
            const htmlContent = fs.readFileSync(indexPath, 'utf8');

            const htmlTests = [
                {
                    name: 'Мини-игра "Дождь монет" в HTML',
                    test: htmlContent.includes('id="coinRainOverlay"')
                },
                {
                    name: 'Canvas элемент для рендеринга',
                    test: htmlContent.includes('id="coinRainCanvas"')
                },
                {
                    name: 'UI элементы статистики',
                    test: htmlContent.includes('id="coinsCaught"') && htmlContent.includes('id="timeLeft"')
                },
                {
                    name: 'Результирующий экран',
                    test: htmlContent.includes('id="coinRainResult"')
                },
                {
                    name: 'Кнопка закрытия игры',
                    test: htmlContent.includes('id="coinRainClose"')
                },
                {
                    name: 'Заголовок "ДОЖДЬ МОНЕТ!"',
                    test: htmlContent.includes('ДОЖДЬ МОНЕТ!')
                }
            ];

            for (const test of htmlTests) {
                this.runTest(test.name, test.test, test.test ? 'Структура корректна' : 'Структура неверна');
            }

            this.log('✅ HTML структура проверена', 'success');

        } catch (error) {
            this.runTest('HTML структура', false, error.message);
        }
    }

    async testCssStyles() {
        this.log('🎨 Проверка CSS стилей...', 'info');
        
        try {
            const indexPath = path.join(__dirname, 'index.html');
            const htmlContent = fs.readFileSync(indexPath, 'utf8');

            const cssTests = [
                {
                    name: 'Стиль оверлея мини-игры',
                    test: htmlContent.includes('#coinRainOverlay')
                },
                {
                    name: 'Стиль canvas элемента',
                    test: htmlContent.includes('#coinRainCanvas')
                },
                {
                    name: 'Стили UI интерфейса',
                    test: htmlContent.includes('#coinRainUI')
                },
                {
                    name: 'Анимация заголовка',
                    test: htmlContent.includes('coinRainTitlePulse') || htmlContent.includes('titlePulse')
                },
                {
                    name: 'Градиентный фон',
                    test: htmlContent.includes('linear-gradient')
                },
                {
                    name: 'Адаптивный дизайн',
                    test: htmlContent.includes('@media')
                }
            ];

            for (const test of cssTests) {
                this.runTest(test.name, test.test, test.test ? 'Стили найдены' : 'Стили отсутствуют');
            }

            this.log('✅ CSS стили проверены', 'success');

        } catch (error) {
            this.runTest('CSS стили', false, error.message);
        }
    }

    async testJavaScriptLogic() {
        this.log('⚙️ Проверка JavaScript логики...', 'info');
        
        try {
            const indexPath = path.join(__dirname, 'index.html');
            const htmlContent = fs.readFileSync(indexPath, 'utf8');

            const jsTests = [
                {
                    name: 'Функция startCoinRainGame',
                    test: htmlContent.includes('function startCoinRainGame')
                },
                {
                    name: 'Класс Coin',
                    test: htmlContent.includes('class Coin')
                },
                {
                    name: 'Canvas рендеринг',
                    test: htmlContent.includes('getContext(\'2d\')')
                },
                {
                    name: 'Обработка кликов',
                    test: htmlContent.includes('handleClick') || htmlContent.includes('addEventListener(\'click\'')
                },
                {
                    name: 'Touch события',
                    test: htmlContent.includes('touchstart') || htmlContent.includes('touch')
                },
                {
                    name: 'Таймер игры',
                    test: htmlContent.includes('setInterval') && htmlContent.includes('timeLeft')
                },
                {
                    name: 'Анимационный цикл',
                    test: htmlContent.includes('requestAnimationFrame')
                },
                {
                    name: 'Спавн монет',
                    test: htmlContent.includes('spawnCoin') || htmlContent.includes('new Coin')
                }
            ];

            for (const test of jsTests) {
                this.runTest(test.name, test.test, test.test ? 'Логика реализована' : 'Логика отсутствует');
            }

            this.log('✅ JavaScript логика проверена', 'success');

        } catch (error) {
            this.runTest('JavaScript логика', false, error.message);
        }
    }

    async testGameParameters() {
        this.log('🎯 Проверка параметров игры...', 'info');
        
        try {
            const indexPath = path.join(__dirname, 'index.html');
            const htmlContent = fs.readFileSync(indexPath, 'utf8');

            // Извлекаем параметры из кода
            const parameterTests = [
                {
                    name: 'Длительность 4 секунды',
                    pattern: /GAME_DURATION.*=.*4000/,
                    requirement: '4000ms (4 секунды)'
                },
                {
                    name: 'Стоимость монеты 5₽',
                    pattern: /COIN_VALUE.*=.*5/,
                    requirement: '5 рублей'
                },
                {
                    name: 'Максимум 800₽',
                    pattern: /MAX_TOTAL_VALUE.*=.*800/,
                    requirement: '800 рублей'
                },
                {
                    name: 'Расчет количества монет',
                    pattern: /MAX_COINS.*=.*Math\.floor.*MAX_TOTAL_VALUE.*COIN_VALUE/,
                    requirement: '160 монет (800÷5)'
                },
                {
                    name: 'Интервал спавна 100мс',
                    pattern: /setInterval.*spawnCoin.*100/,
                    requirement: '100 миллисекунд'
                }
            ];

            for (const test of parameterTests) {
                const found = test.pattern.test(htmlContent);
                this.runTest(test.name, found, found ? `Соответствует: ${test.requirement}` : `Не найдено: ${test.requirement}`);
                
                if (found) {
                    this.testResults.gameParameters[test.name] = test.requirement;
                }
            }

            this.log('✅ Параметры игры проверены', 'success');

        } catch (error) {
            this.runTest('Параметры игры', false, error.message);
        }
    }

    async testIntegration() {
        this.log('🔗 Проверка интеграции с основной игрой...', 'info');
        
        try {
            const indexPath = path.join(__dirname, 'index.html');
            const htmlContent = fs.readFileSync(indexPath, 'utf8');

            const integrationTests = [
                {
                    name: 'Случайный выбор мини-игр',
                    test: htmlContent.includes('Math.random() < 0.5') && htmlContent.includes('startCoinRainGame')
                },
                {
                    name: 'Запуск при выигрышах',
                    test: htmlContent.includes('totalWin') && htmlContent.includes('betAmount')
                },
                {
                    name: 'Добавление к балансу',
                    test: htmlContent.includes('balance += totalCaught') || htmlContent.includes('balance + totalCaught')
                },
                {
                    name: 'Обновление UI',
                    test: htmlContent.includes('updateUI()')
                },
                {
                    name: 'Сообщения в чат',
                    test: htmlContent.includes('addBotMessage') && htmlContent.includes('Дождь монет')
                },
                {
                    name: 'Вибрация (Telegram)',
                    test: htmlContent.includes('vibrate()')
                },
                {
                    name: 'Обновленные правила',
                    test: htmlContent.includes('Дождь монет') && htmlContent.includes('5₽ за монету')
                }
            ];

            for (const test of integrationTests) {
                this.runTest(test.name, test.test, test.test ? 'Интеграция корректна' : 'Интеграция неполная');
            }

            this.log('✅ Интеграция проверена', 'success');

        } catch (error) {
            this.runTest('Интеграция', false, error.message);
        }
    }

    runTest(name, passed, details) {
        this.testResults.testsRun++;
        
        if (passed) {
            this.testResults.testsPassed++;
            console.log(`✅ ${name}: ${details}`);
        } else {
            this.testResults.testsFailed++;
            console.log(`❌ ${name}: ${details}`);
        }
        
        this.testResults.details.push({
            name,
            passed,
            details,
            timestamp: new Date()
        });
    }

    generateFinalReport() {
        console.log('\n' + '=' .repeat(60));
        console.log('📊 ИТОГОВЫЙ ОТЧЕТ ТЕСТИРОВАНИЯ');
        console.log('=' .repeat(60));

        const endTime = new Date();
        const duration = Math.round((endTime - this.testResults.startTime) / 1000);

        console.log(`⏱️  Время выполнения: ${duration} секунд`);
        console.log(`📋 Всего тестов: ${this.testResults.testsRun}`);
        console.log(`✅ Пройдено: ${this.testResults.testsPassed}`);
        console.log(`❌ Провалено: ${this.testResults.testsFailed}`);
        
        const successRate = Math.round((this.testResults.testsPassed / this.testResults.testsRun) * 100);
        console.log(`📈 Успешность: ${successRate}%`);

        // Анализ по категориям
        console.log('\n📂 АНАЛИЗ ПО КАТЕГОРИЯМ:');
        
        const codeAnalysisCount = Object.values(this.testResults.codeAnalysis).filter(v => v === true).length;
        console.log(`   🔍 Анализ кода: ${codeAnalysisCount}/9 элементов найдено`);
        
        const parameterCount = Object.keys(this.testResults.gameParameters).length;
        console.log(`   🎯 Параметры игры: ${parameterCount}/5 параметров корректны`);

        // Статус соответствия требованиям
        console.log('\n🎯 СООТВЕТСТВИЕ ТРЕБОВАНИЯМ:');
        
        const requirements = [
            { name: '4 секунды игрового времени', key: 'GAME_DURATION.*4000' },
            { name: '1 монета = 5 рублей', key: 'COIN_VALUE.*5' },
            { name: 'Максимум 800 рублей', key: 'MAX_TOTAL_VALUE.*800' },
            { name: 'Тап-механика', key: 'handleClick|addEventListener.*click' },
            { name: 'Canvas анимация', key: 'requestAnimationFrame' }
        ];

        const indexPath = path.join(__dirname, 'index.html');
        const htmlContent = fs.readFileSync(indexPath, 'utf8');

        requirements.forEach(req => {
            const regex = new RegExp(req.key);
            const met = regex.test(htmlContent);
            console.log(`   ${met ? '✅' : '❌'} ${req.name}`);
        });

        // Общая оценка
        console.log('\n🏆 ОБЩАЯ ОЦЕНКА:');
        if (successRate >= 90) {
            console.log('   🌟 ОТЛИЧНО - Мини-игра полностью соответствует требованиям!');
        } else if (successRate >= 75) {
            console.log('   👍 ХОРОШО - Мини-игра реализована с незначительными замечаниями');
        } else if (successRate >= 60) {
            console.log('   ⚠️  УДОВЛЕТВОРИТЕЛЬНО - Требуются доработки');
        } else {
            console.log('   ❌ НЕУДОВЛЕТВОРИТЕЛЬНО - Критические ошибки в реализации');
        }

        // Рекомендации
        console.log('\n💡 РЕКОМЕНДАЦИИ:');
        if (this.testResults.testsFailed === 0) {
            console.log('   🎉 Все тесты пройдены успешно! Мини-игра готова к использованию.');
        } else {
            console.log('   🔧 Обратите внимание на неудачные тесты выше');
            console.log('   📝 Проверьте корректность реализации отмеченных элементов');
        }

        // Сохранение детального отчета
        this.saveDetailedReport();

        console.log('\n🔗 ССЫЛКИ ДЛЯ ТЕСТИРОВАНИЯ:');
        console.log('   🌐 Основная игра: http://localhost:8080/index.html');
        console.log('   💰 Демо дождя монет: http://localhost:8080/coin-rain-demo.html');
        console.log('   🧪 Тестовая панель: http://localhost:8080/test-coin-rain-in-game.html');
        
        console.log('\n' + '=' .repeat(60));
    }

    saveDetailedReport() {
        const reportData = {
            summary: {
                timestamp: new Date().toISOString(),
                totalTests: this.testResults.testsRun,
                passed: this.testResults.testsPassed,
                failed: this.testResults.testsFailed,
                successRate: Math.round((this.testResults.testsPassed / this.testResults.testsRun) * 100)
            },
            codeAnalysis: this.testResults.codeAnalysis,
            gameParameters: this.testResults.gameParameters,
            detailedResults: this.testResults.details.map(test => ({
                name: test.name,
                passed: test.passed,
                details: test.details
            }))
        };

        const reportPath = path.join(__dirname, 'coin-rain-test-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
        
        console.log(`📄 Детальный отчет сохранен: ${reportPath}`);
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] ${message}`);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Запуск тестирования
const tester = new CoinRainGameTester();
tester.runAllTests().catch(error => {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
});