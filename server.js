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

async function checkPasswordHash(password, hash) {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
}


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

        await connection.query(`
            CREATE TABLE IF NOT EXISTS phones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                price VARCHAR(50),
                image TEXT
            );
        `);
        await connection.query(`
            INSERT INTO phones (name, price, image) VALUES
                ('iPhone 14', '$799', 'https://placehold.co/200'),
                ('Samsung Galaxy S23', '$699', 'https://placehold.co/200'),
                ('Xiaomi 13', '$599', 'https://placehold.co/200'),
                ('Google Pixel 7', '$649', 'https://placehold.co/200');
        `);
        console.log('✅ Таблица phones создана');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS favorites (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT,
                phoneId INT,
                UNIQUE KEY unique_favorite (userId, phoneId)
            );
        `);
        console.log('✅ Таблица favorites создана');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS cart (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT,
                phoneId INT,
                quantity INT DEFAULT 1,
                UNIQUE KEY unique_cart (userId, phoneId)
            );
        `);
        console.log('✅ Таблица favorites создана');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) DEFAULT 'processing'
            );
        `);
        console.log('✅ Таблица orders создана');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                orderId INT,
                phoneId INT,
                quantity INT
            );
        `);
        console.log('✅ Таблица order_items создана');
        
        
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

        // checkPasswordHash(password, existing[0].passwordHash).then(isValid => {
        //     if (isValid) {
        //         console.log('✅ Пароль правильный!');
        //     } else {
        //         console.log('❌ Неверный пароль!');
        //     }
        // });
        console.log(checkPasswordHash(password ,existing[0].passwordHash))
        //console.log(existing[0].passwordHash)

        const isValidPassword = await checkPasswordHash(password, existing[0].passwordHash);

        if (existing.length  === 0 || !isValidPassword) {
            await connection.end();
            return res.status(400).json({
                success: false,
                message: 'Неправильный логин или пароль'
            });
        }
        
        await connection.end();
        
        res.json({ 
            success: true, 
            message: 'Авторизация прошла успешно',
            userId: existing[0].id
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

// 📦 получить все телефоны
app.get("/phones", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;

        const offset = (page - 1) * limit;

        const connection = await mysql.createConnection({
            ...config,
            database: "shop2_db"
        });

        const [rows] = await connection.query(
            "SELECT * FROM phones LIMIT ? OFFSET ?",
            [limit, offset]
        );

        const [countResult] = await connection.query(
            "SELECT COUNT(*) as count FROM phones"
        );

        await connection.end();

        res.json({
            data: rows,
            total: countResult[0].count
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Добавить в избранное
app.post("/api/favorites", async (req, res) => {
    try {
        const { userId, phoneId } = req.body;

        const connection = await mysql.createConnection({
            ...config,
            database: "shop2_db"
        });

        await connection.query(
            "INSERT IGNORE INTO favorites (userId, phoneId) VALUES (?, ?)",
            [userId, phoneId]
        );

        await connection.end();

        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Удалить из избранного
app.delete("/api/favorites/:userId/:phoneId", async (req, res) => {
    try {
        const { userId, phoneId } = req.params;

        const connection = await mysql.createConnection({
            ...config,
            database: "shop2_db"
        });

        await connection.query(
            "DELETE FROM favorites WHERE userId = ? AND phoneId = ?",
            [userId, phoneId]
        );

        await connection.end();

        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Получить избранное
app.get("/api/favorites/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const connection = await mysql.createConnection({
            ...config,
            database: "shop2_db"
        });

        const [rows] = await connection.query(`
            SELECT phones.* 
            FROM favorites
            JOIN phones ON phones.id = favorites.phoneId
            WHERE favorites.userId = ?
        `, [userId]);

        await connection.end();

        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Добавить в корзину
app.post("/api/cart", async (req, res) => {
    try {
        const { userId, phoneId } = req.body;

        const connection = await mysql.createConnection({
            ...config,
            database: "shop2_db"
        });

        // если уже есть — увеличиваем количество
        await connection.query(`
            INSERT INTO cart (userId, phoneId, quantity)
            VALUES (?, ?, 1)
            ON DUPLICATE KEY UPDATE quantity = quantity + 1
        `, [userId, phoneId]);

        await connection.end();

        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Удалить из корзины
app.delete("/api/cart/:userId/:phoneId", async (req, res) => {
    try {
        const { userId, phoneId } = req.params;

        const connection = await mysql.createConnection({
            ...config,
            database: "shop2_db"
        });

        await connection.query(
            "DELETE FROM cart WHERE userId = ? AND phoneId = ?",
            [userId, phoneId]
        );

        await connection.end();

        res.json({ success: true });

    } catch (error) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Получить из корзины
app.get("/api/cart/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const connection = await mysql.createConnection({
            ...config,
            database: "shop2_db"
        });

        const [rows] = await connection.query(`
            SELECT phones.*, cart.quantity
            FROM cart
            JOIN phones ON phones.id = cart.phoneId
            WHERE cart.userId = ?
        `, [userId]);

        await connection.end();

        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

app.get("/api/profile/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const connection = await mysql.createConnection({
            ...config,
            database: "shop2_db"
        });

        const [rows] = await connection.query(
            "SELECT id, email, name, createdAt FROM users WHERE id = ?",
            [userId]
        );

        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/phones/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const connection = await mysql.createConnection({
            ...config,
            database: "shop2_db"
        });

        const [rows] = await connection.query(
            "SELECT * FROM phones WHERE id = ?",
            [id]
        );

        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Получить заказы
app.get("/api/orders/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const connection = await mysql.createConnection({
            ...config,
            database: "shop2_db"
        });

        const [orders] = await connection.query(`
            SELECT * FROM orders WHERE userId = ?
        `, [userId]);

        for (let order of orders) {
            const [items] = await connection.query(`
                SELECT phones.*, order_items.quantity
                FROM order_items
                JOIN phones ON phones.id = order_items.phoneId
                WHERE order_items.orderId = ?
            `, [order.id]);

            order.items = items;
        }

        await connection.end();

        res.json(orders);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/user/:id", async (req, res) => {
  const { id } = req.params;

  const connection = await mysql.createConnection({
    ...config,
    database: "shop2_db"
  });

  const [rows] = await connection.query(
    "SELECT id, name FROM users WHERE id = ?",
    [id]
  );

  await connection.end();

  res.json(rows[0]);
});

// Запускаем HTTP сервер
app.listen(HTTP_PORT, () => {
    console.log(`🚀 HTTP сервер запущен на http://localhost:${HTTP_PORT}`);
});

// Запускаем настройку базы данных
setupDatabase();