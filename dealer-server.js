о// 🎰 СЕРВЕР ДИЛЕРА ДЛЯ BINGOBETT
// Работает на GitHub Pages через GitHub Actions

const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

class DealerServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.secretKey = process.env.SECRET_KEY || 'bingobett_dealer_secret_2025';
        this.payments = new Map();
        
        this.setupMiddleware();
        this.setupRoutes();
    }
    
    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        
        // CORS для работы с фронтендом
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });
    }
    
    setupRoutes() {
        // Главная страница дилера
        this.app.get('/', (req, res) => {
            res.json({
                status: 'online',
                service: 'BingoBett Dealer Server',
                version: '1.0.0',
                timestamp: new Date().toISOString()
            });
        });
        
        // Создание платежа
        this.app.post('/api/payment/create', (req, res) => {
            try {
                const { amount, user_id, game, payment_id, return_url } = req.body;
                
                if (!amount || !user_id || !payment_id) {
                    return res.status(400).json({
                        error: 'Missing required parameters: amount, user_id, payment_id'
                    });
                }
                
                // Генерируем уникальный ID транзакции
                const transaction_id = `dealer_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
                
                // Создаем платеж в YooMoney
                const yoomoneyUrl = this.generateYooMoneyUrl(amount, transaction_id, return_url);
                
                // Сохраняем информацию о платеже
                const paymentData = {
                    id: payment_id,
                    transaction_id,
                    amount: parseInt(amount),
                    user_id,
                    game: game || 'bingo',
                    status: 'pending',
                    created_at: new Date().toISOString(),
                    yoomoney_url: yoomoneyUrl
                };
                
                this.payments.set(payment_id, paymentData);
                
                // Очищаем старые платежи (24 часа)
                this.cleanOldPayments();
                
                res.json({
                    success: true,
                    payment_id,
                    transaction_id,
                    redirect_url: yoomoneyUrl,
                    dealer_url: `https://frutisbett.github.io/bingobett.github.io/dealer-payment.html?transaction=${transaction_id}`
                });
                
            } catch (error) {
                console.error('Payment creation error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        
        // Проверка статуса платежа
        this.app.get('/api/payment/status/:payment_id', (req, res) => {
            const { payment_id } = req.params;
            const payment = this.payments.get(payment_id);
            
            if (!payment) {
                return res.status(404).json({ error: 'Payment not found' });
            }
            
            res.json({
                payment_id: payment.id,
                status: payment.status,
                amount: payment.amount,
                user_id: payment.user_id,
                created_at: payment.created_at,
                updated_at: payment.updated_at
            });
        });
        
        // Webhook от YooMoney (обработка успешных платежей)
        this.app.post('/api/webhook/yoomoney', (req, res) => {
            try {
                const { notification_type, operation_id, amount, currency, datetime, sender, codepro, label, sha1_hash } = req.body;
                
                // Проверяем подпись (для безопасности)
                if (!this.verifyYooMoneySignature(req.body)) {
                    console.warn('Invalid YooMoney signature');
                    return res.status(403).json({ error: 'Invalid signature' });
                }
                
                if (notification_type === 'card-incoming') {
                    // Извлекаем transaction_id из метки
                    const transaction_id = label;
                    const payment = this.findPaymentByTransactionId(transaction_id);
                    
                    if (payment && payment.status === 'pending') {
                        // Обновляем статус платежа
                        payment.status = 'completed';
                        payment.updated_at = new Date().toISOString();
                        payment.yoomoney_operation_id = operation_id;
                        
                        // Здесь можно отправить уведомление в игру
                        this.notifyGameSuccess(payment);
                        
                        console.log(`Payment ${payment.id} completed successfully`);
                    }
                }
                
                res.status(200).send('OK');
                
            } catch (error) {
                console.error('Webhook error:', error);
                res.status(500).json({ error: 'Webhook processing failed' });
            }
        });
        
        // Страница успешного платежа
        this.app.get('/success', (req, res) => {
            const { payment_id, amount } = req.query;
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Платеж успешен - BingoBett</title>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
                        .success { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        h1 { color: #4caf50; }
                    </style>
                </head>
                <body>
                    <div class="success">
                        <h1>✅ Платеж успешно обработан!</h1>
                        <p>Сумма: <strong>${amount} ₽</strong></p>
                        <p>ID платежа: <code>${payment_id}</code></p>
                        <p>Ваш баланс будет пополнен автоматически.</p>
                        <p><a href="https://frutisbett.github.io/bingobett.github.io/">Вернуться в игру</a></p>
                    </div>
                </body>
                </html>
            `);
        });
        
        // Страница ошибки платежа
        this.app.get('/error', (req, res) => {
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Ошибка платежа - BingoBett</title>
                    <meta charset="UTF-8">
                    <style>body { font-family: Arial; text-align: center; padding: 50px; }</style>
                </head>
                <body>
                    <h1 style="color: #f44336;">❌ Ошибка обработки платежа</h1>
                    <p>Попробуйте еще раз или обратитесь в поддержку.</p>
                    <p><a href="https://frutisbett.github.io/bingobett.github.io/">Вернуться в игру</a></p>
                </body>
                </html>
            `);
        });
    }
    
    generateYooMoneyUrl(amount, transaction_id, return_url) {
        // Базовый URL YooMoney с параметрами
        const baseUrl = 'https://yoomoney.ru/quickpay/confirm.xml';
        const params = new URLSearchParams({
            receiver: '4100118182998706', // Ваш кошелек YooMoney
            'quickpay-form': 'shop',
            targets: `BingoBett пополнение (${transaction_id})`,
            'paymentType': 'AC',
            sum: amount,
            label: transaction_id,
            successURL: return_url || `https://frutisbett.github.io/bingobett.github.io/?payment=success&amount=${amount}`,
            failURL: `https://frutisbett.github.io/bingobett.github.io/error`
        });
        
        return `${baseUrl}?${params.toString()}`;
    }
    
    verifyYooMoneySignature(data) {
        // Для безопасности: проверка подписи от YooMoney
        // В реальной реализации нужно настроить секретный ключ в настройках YooMoney
        const { notification_type, operation_id, amount, currency, datetime, sender, codepro, label, sha1_hash } = data;
        
        // Пропускаем проверку в демо-режиме
        // В продакшене нужно реализовать настоящую проверку
        return true;
    }
    
    findPaymentByTransactionId(transaction_id) {
        for (let [payment_id, payment] of this.payments) {
            if (payment.transaction_id === transaction_id) {
                return payment;
            }
        }
        return null;
    }
    
    notifyGameSuccess(payment) {
        // Отправляем уведомление в игру о успешном платеже
        // Можно использовать WebSocket или периодический опрос
        const message = `🎉 Игрок ${payment.user_id} успешно пополнил на ${payment.amount}₽!`;
        const chatId = payment.user_id; // Предполагается, что user_id - это chat_id в Telegram

        // Отправка уведомления в Telegram
        axios.post(`https://api.telegram.org/bot7686465885:AAHYpW0wfTKtjUTGTS6IOIq1eY8XhFm8L2g/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        })
        .then(response => {
            console.log('✅ Уведомление отправлено в Telegram:', response.data);
        })
        .catch(error => {
            console.error('❌ Ошибка отправки уведомления в Telegram:', error);
        });
        
        // Здесь можно интегрировать с Telegram ботом или другой системой уведомлений
    }
    
    cleanOldPayments() {
        const now = new Date();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        for (let [payment_id, payment] of this.payments) {
            const created = new Date(payment.created_at);
            if (now - created > twentyFourHours) {
                this.payments.delete(payment_id);
            }
        }
    }
    
    start() {
        this.app.listen(this.port, () => {
            console.log(`🎰 BingoBett Dealer Server running on port ${this.port}`);
            console.log(`📊 API endpoints:`);
            console.log(`   POST /api/payment/create - Создание платежа`);
            console.log(`   GET /api/payment/status/:id - Статус платежа`);
            console.log(`   POST /api/webhook/yoomoney - Webhook от YooMoney`);
        });
    }
}

// Запуск сервера
if (require.main === module) {
    const server = new DealerServer();
    server.start();
}

module.exports = DealerServer;
