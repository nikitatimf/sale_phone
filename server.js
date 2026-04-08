const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');  // ← ДОБАВИТЬ
const app = express();
const bcrypt = require('bcrypt');

// НАСТРОЙКИ CORS - ДОБАВИТЬ ЭТО
app.use(cors({
    origin: 'http://localhost:5173',  // Разрешаем запросы с React приложения
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// НАСТРОЙКИ ПОДКЛЮЧЕНИЯ К MYSQL
const config = {
    host: 'localhost',
    user: 'root',
    password: 'Nikita228@',
    port: 3306
};

const HTTP_PORT = 5000;

async function setupDatabase() {
    let connection;
    
    try {
        connection = await mysql.createConnection(config);
        console.log('✅ Подключение к MySQL установлено');
        
        await connection.query('CREATE DATABASE IF NOT EXISTS shop2_db');
        console.log('✅ База данных shop2_db создана');
        
        await connection.changeUser({ database: 'shop2_db' });
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) UNIQUE NOT NULL,
                passwordHash VARCHAR(255) NOT NULL,
                name VARCHAR(100) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Таблица users создана');
        
        console.log('\n🎉 База данных готова к работе!');
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.error('\n💡 Решение:');
            console.error('1. Запустите MySQL Server');
            console.error('2. Проверьте пароль в файле');
        }
    }
}

// API маршруты
app.post('/api/auth/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        console.log('Получены данные:', { email, password });

        // Подключаемся к базе
        const connection = await mysql.createConnection({
            ...config,
            database: 'shop2_db'
        });

        // Проверяем, существует ли пользователь
        const [existing] = await connection.query(
            'SELECT * FROM users WHERE email = ?', [email]
        );

        /*if (existing.length > 0) {
            await connection.end();
            return res.status(400).json({
                success: false,
                message: 'Пользователь с таким email уже существует'
            });
        }*/
        
        await connection.end();
        
        res.json({ 
            success: true, 
            message: 'Авторизация прошла успешно'
        });


    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера при авторизации' 
        });
    }

})

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name} = req.body;
        
        //console.log('Получены данные:', { email, password });
        
        // Подключаемся к базе
        const connection = await mysql.createConnection({
            ...config,
            database: 'shop2_db'
        });
        
        // Проверяем, существует ли пользователь
        const [existing] = await connection.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        
        if (existing.length > 0) {
            await connection.end();
            return res.status(400).json({
                success: false,
                message: 'Пользователь с таким email уже существует'
            });
        }
        
        // // Хешируем пароль (рекомендуется использовать bcrypt)
        const hashedPassword = await bcrypt.hash(password, 10);

        //console.log(hashedPassword)
        
        // Сохраняем пользователя
        const [result] = await connection.query(
            'INSERT INTO users (email, passwordHash, name) VALUES (?, ?, ?)',
            [email, hashedPassword, name]  // В реальном проекте используйте хеш пароля
        );
        
        await connection.end();
        
        res.json({ 
            success: true, 
            message: 'Пользователь успешно зарегистрирован',
            userId: result.insertId
        });
        
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера при регистрации' 
        });
    }
});



// Запускаем HTTP сервер
app.listen(HTTP_PORT, () => {
    console.log(`🚀 HTTP сервер запущен на http://localhost:${HTTP_PORT}`);
});

// Запускаем настройку базы данных
setupDatabase();