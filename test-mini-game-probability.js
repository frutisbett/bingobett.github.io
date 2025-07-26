#!/usr/bin/env node

/**
 * Тест вероятности запуска мини-игр
 * Сравнение старого (8%) и нового (13%) шанса
 */

console.log('🎰 ТЕСТ ВЕРОЯТНОСТИ МИНИ-ИГР');
console.log('=' .repeat(50));

function simulateMiniGameChance(probability, totalSpins = 1000) {
    let miniGameCount = 0;
    
    for (let i = 0; i < totalSpins; i++) {
        if (Math.random() < probability) {
            miniGameCount++;
        }
    }
    
    return {
        totalSpins,
        miniGames: miniGameCount,
        actualPercent: (miniGameCount / totalSpins * 100).toFixed(1),
        expectedPercent: (probability * 100).toFixed(1)
    };
}

// Тест для 1000 спинов
console.log('📊 Симуляция на 1000 спинов:\n');

const oldChance = simulateMiniGameChance(0.08); // Старый шанс 8%
const newChance = simulateMiniGameChance(0.13); // Новый шанс 13%

console.log('❌ СТАРЫЙ ШАНС (8%):');
console.log(`   Мини-игр: ${oldChance.miniGames}/${oldChance.totalSpins}`);
console.log(`   Фактически: ${oldChance.actualPercent}%`);
console.log(`   Ожидалось: ${oldChance.expectedPercent}%`);

console.log('\n✅ НОВЫЙ ШАНС (13%):');
console.log(`   Мини-игр: ${newChance.miniGames}/${newChance.totalSpins}`);
console.log(`   Фактически: ${newChance.actualPercent}%`);
console.log(`   Ожидалось: ${newChance.expectedPercent}%`);

// Разница в количестве мини-игр
const difference = newChance.miniGames - oldChance.miniGames;
const improvement = ((newChance.miniGames / oldChance.miniGames - 1) * 100).toFixed(1);

console.log('\n🚀 УЛУЧШЕНИЕ:');
console.log(`   Дополнительные мини-игры: +${difference}`);
console.log(`   Увеличение на: +${improvement}%`);

// Тест для вашего случая (80 спинов)
console.log('\n' + '=' .repeat(50));
console.log('🎯 СИМУЛЯЦИЯ ВАШЕГО СЛУЧАЯ (80 спинов):\n');

function testForYourCase(spins = 80, trials = 10) {
    console.log(`Запуск ${trials} испытаний по ${spins} спинов каждое:\n`);
    
    let oldResults = [];
    let newResults = [];
    
    for (let trial = 1; trial <= trials; trial++) {
        const oldTest = simulateMiniGameChance(0.08, spins);
        const newTest = simulateMiniGameChance(0.13, spins);
        
        oldResults.push(oldTest.miniGames);
        newResults.push(newTest.miniGames);
        
        console.log(`Испытание ${trial}: Старый=${oldTest.miniGames}, Новый=${newTest.miniGames}`);
    }
    
    const oldAvg = (oldResults.reduce((a, b) => a + b, 0) / trials).toFixed(1);
    const newAvg = (newResults.reduce((a, b) => a + b, 0) / trials).toFixed(1);
    
    const oldZeros = oldResults.filter(r => r === 0).length;
    const newZeros = newResults.filter(r => r === 0).length;
    
    console.log('\n📈 РЕЗУЛЬТАТЫ:');
    console.log(`   Старый шанс - среднее: ${oldAvg} мини-игр`);
    console.log(`   Новый шанс - среднее: ${newAvg} мини-игр`);
    console.log(`   Случаев без мини-игр:`);
    console.log(`     Старый: ${oldZeros}/${trials} (${(oldZeros/trials*100).toFixed(1)}%)`);
    console.log(`     Новый: ${newZeros}/${trials} (${(newZeros/trials*100).toFixed(1)}%)`);
}

testForYourCase();

// Математические ожидания
console.log('\n' + '=' .repeat(50));
console.log('🧮 МАТЕМАТИЧЕСКИЕ ОЖИДАНИЯ:\n');

console.log('Для 80 спинов:');
console.log(`   Старый шанс (8%): ~${(80 * 0.08).toFixed(1)} мини-игр`);
console.log(`   Новый шанс (13%): ~${(80 * 0.13).toFixed(1)} мини-игр`);

console.log('\nВероятность НЕ получить мини-игру за 80 спинов:');
const oldNoMiniGame = Math.pow(0.92, 80) * 100; // 92% не получить * 80 раз
const newNoMiniGame = Math.pow(0.87, 80) * 100; // 87% не получить * 80 раз

console.log(`   Старый шанс (8%): ${oldNoMiniGame.toFixed(3)}%`);
console.log(`   Новый шанс (13%): ${newNoMiniGame.toFixed(3)}%`);

console.log('\n🎊 ЗАКЛЮЧЕНИЕ:');
console.log('   Шанс увеличен с 8% до 13% (+5%)');
console.log('   Теперь мини-игры будут появляться значительно чаще!');
console.log('   В среднем каждые 7-8 выигрышных спинов вместо 12-13');

console.log('\n' + '=' .repeat(50));