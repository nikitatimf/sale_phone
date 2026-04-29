const mysql = require('mysql2/promise');
const express = require('express');
const app = express();

app.use(express.json());

// НАСТРОЙКИ ПОДКЛЮЧЕНИЯ
const config = {
    host: 'localhost',
    user: 'root',
    password: 'Nikita228@',  // ЗАМЕНИТЕ НА ВАШ ПАРОЛЬ
    port: 3306
};

async function setupDatabase() {
    let connection;
    
    try {
        // Подключаемся к MySQL
        connection = await mysql.createConnection(config);
        console.log('✅ Подключение к MySQL установлено');
        
        // Создаем базу данных
        await connection.query('CREATE DATABASE IF NOT EXISTS shop2_db');
        console.log('✅ База данных shop2_db создана');
        
        // Переключаемся на новую базу
        await connection.changeUser({ database: 'shop2_db' });
        
        // Создаем таблицу пользователей
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) UNIQUE NOT NULL,
                passwordHash VARCHAR(100) MOT NULL,
                name VARCHAR(100) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Таблица users создана');
        
        // Добавляем тестовые данные
        /*await connection.query(`
            INSERT INTO users (name, email, age) VALUES 
            ('Иван Петров', 'ivan@example.com', 25),
            ('Мария Сидорова', 'maria@example.com', 30)
            ON DUPLICATE KEY UPDATE name = name
        `);
        console.log('✅ Тестовые данные добавлены');
        
        // Проверяем результат
        const [users] = await connection.query('SELECT * FROM users');
        console.log('\n📋 Пользователи в базе:');
        users.forEach(user => {
            console.log(`   ID: ${user.id}, Имя: ${user.name}, Email: ${user.email}`);
        });*/
        
        console.log('\n🎉 База данных готова к работе!');
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.error('\n💡 Решение:');
            console.error('1. Запустите MySQL Server');
            console.error('2. Проверьте пароль в файле setup.js');
        }
    }
    // } finally {
    //     if (connection) {
    //         await connection.end();
    //         console.log('\n🔌 Соединение закрыто');
    //     }
    // }
}

app.get('/api/auth/register', (req, res) => {
    res.json({message: 'aaaaa'})
})

setupDatabase();