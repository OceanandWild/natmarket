// backend/server.js
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});


// ------------------
// HELPERS
// ------------------
function handleServerError(res, err, where = '') {
  console.error(`[ERROR ${where}]`, err?.message || err);
  res.status(500).json({ error: err?.message || String(err) });
}

// ------------------
// INIT DB
// ------------------
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL,
        image_url TEXT,
        contact_number TEXT,
        created_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS user_ratings (
        id SERIAL PRIMARY KEY,
        rated_user_id INT REFERENCES users(id) ON DELETE CASCADE,
        rater_user_id INT REFERENCES users(id) ON DELETE CASCADE,
        rating INT CHECK (rating BETWEEN 1 AND 5),
        created_at TIMESTAMP DEFAULT now()
      );

  CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
  );


    `);
    await pool.query(`
  ALTER TABLE user_ratings
  ADD COLUMN IF NOT EXISTS comment TEXT,
  ADD COLUMN IF NOT EXISTS product_id INT REFERENCES products(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS type VARCHAR(10) DEFAULT 'product';
`);

    console.log('✅ Tablas verificadas/creadas correctamente.');
  } catch (err) {
    console.error('❌ Error inicializando DB:', err);
    process.exit(1);
  }
}

// ------------------
// AUTH
// ------------------
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username y password requeridos' });

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1,$2) RETURNING id, username',
      [username, hashed]
    );
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Usuario ya existe' });
    handleServerError(res, err, '/register');
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username y password requeridos' });

    const result = await pool.query('SELECT id, username, password FROM users WHERE username = $1', [username]);
    if (result.rowCount === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Contraseña incorrecta' });

    res.json({ id: user.id, username: user.username });
  } catch (err) {
    handleServerError(res, err, '/login');
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, username, created_at FROM users WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    handleServerError(res, err, 'GET /users/:id');
  }
});

app.put('/users/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ error: 'Debe enviar contraseña actual y nueva' });

    const userRes = await pool.query('SELECT password FROM users WHERE id = $1', [id]);
    if (userRes.rowCount === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = userRes.rows[0];
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) return res.status(401).json({ error: 'Contraseña actual incorrecta' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, id]);

    res.json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    handleServerError(res, err, 'PUT /users/:id/password');
  }
});

app.post('/messages', async (req, res) => {
  try {
    const { sender_id, product_id, message } = req.body;
    if (!sender_id || !product_id || !message) return res.status(400).json({ error: 'Faltan parámetros' });

    const result = await pool.query(
      'INSERT INTO messages (sender_id, product_id, message) VALUES ($1,$2,$3) RETURNING *',
      [sender_id, product_id, message]
    );

    res.json(result.rows[0]);
  } catch (err) {
    handleServerError(res, err, 'POST /messages');
  }
});

app.get('/messages/:product_id', async (req, res) => {
  try {
    const { product_id } = req.params;

    const result = await pool.query(
      `SELECT m.*, u.username AS sender_username 
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE product_id = $1
       ORDER BY created_at ASC`,
      [product_id]
    );

    res.json(result.rows);
  } catch (err) {
    handleServerError(res, err, 'GET /messages/:product_id');
  }
});


// ------------------
// PRODUCTS
// ------------------
app.post('/products', async (req, res) => {
  try {
    const { user_id, name, description = null, price = null, image_url = null, contact_number = null } = req.body;
    if (!user_id || !name) return res.status(400).json({ error: 'user_id y name son requeridos' });

    const result = await pool.query(
      `INSERT INTO products (user_id, name, description, price, image_url, contact_number)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [user_id, name, description, price, image_url, contact_number]
    );

    res.json(result.rows[0]);
  } catch (err) {
    handleServerError(res, err, 'POST /products');
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: 'user_id requerido para verificar propiedad' });

    const found = await pool.query('SELECT id, user_id FROM products WHERE id = $1 LIMIT 1', [id]);
    if (found.rowCount === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    const product = found.rows[0];
    if (Number(product.user_id) !== Number(user_id)) return res.status(403).json({ error: 'No autorizado' });

    const deleted = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [product.id]);
    res.json({ success: true, deleted: deleted.rows[0] });
  } catch (err) {
    handleServerError(res, err, 'DELETE /products/:id');
  }
});

app.get('/products', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.username,
        COALESCE((
          SELECT ROUND(AVG(rating)::numeric,1) FROM user_ratings WHERE rated_user_id = u.id
        ), 0) AS avg_rating
      FROM products p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    handleServerError(res, err, 'GET /products');
  }
});

// ------------------
// RATINGS
// ------------------
app.post('/rate', async (req, res) => {
  try {
    const { rated_user_id, rater_user_id, rating } = req.body;
    if (!rated_user_id || !rater_user_id || !rating) return res.status(400).json({ error: 'Faltan parámetros' });

    await pool.query(
      'INSERT INTO user_ratings (rated_user_id, rater_user_id, rating) VALUES ($1,$2,$3)',
      [rated_user_id, rater_user_id, rating]
    );

    res.json({ success: true });
  } catch (err) {
    handleServerError(res, err, 'POST /rate');
  }
});

app.post('/rate-product', async (req,res)=>{
  try{
    const { product_id, rater_user_id, rating, comment } = req.body;
    if(!product_id || !rater_user_id || !rating) return res.status(400).json({error:'Faltan parámetros'});
    
    const product = await pool.query('SELECT user_id FROM products WHERE id=$1',[product_id]);
    if(product.rowCount===0) return res.status(404).json({error:'Producto no encontrado'});
    
    await pool.query(
      `INSERT INTO user_ratings (rated_user_id, rater_user_id, rating, comment, product_id, type)
       VALUES ($1,$2,$3,$4,$5,'product')`,
      [product.rows[0].user_id,rater_user_id,rating,comment,product_id]
    );
    
    res.json({success:true});
  }catch(err){handleServerError(res,err,'POST /rate-product');}
});

app.post('/rate-seller', async (req,res)=>{
  try{
    const { seller_id, rater_user_id, rating, comment } = req.body;
    if(!seller_id || !rater_user_id || !rating) return res.status(400).json({error:'Faltan parámetros'});

    await pool.query(
      `INSERT INTO user_ratings (rated_user_id, rater_user_id, rating, comment, type)
       VALUES ($1,$2,$3,$4,'seller')`,
      [seller_id,rater_user_id,rating,comment]
    );

    res.json({success:true});
  }catch(err){handleServerError(res,err,'POST /rate-seller');}
});





// GET /user-ratings/:user_id
app.get('/user-ratings/:user_id', async (req,res)=>{
  try {
    const { user_id } = req.params;
    const result = await pool.query(`
      SELECT r.*, u.username AS rater_username, p.name AS product_name
      FROM user_ratings r
      JOIN users u ON r.rater_user_id = u.id
      LEFT JOIN products p ON p.user_id = r.rated_user_id
      WHERE r.rated_user_id=$1
      ORDER BY r.created_at DESC
    `, [user_id]);

    // calcular promedio
    const ratings = result.rows;
    const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.rating,0)/ratings.length).toFixed(1) : 0;

    res.json({ avg_rating: avg, ratings });
  } catch(err) {
    handleServerError(res, err, 'GET /user-ratings/:user_id');
  }
});

// RATINGS
app.get('/ratings/product/:product_id', async(req,res)=>{
  try {
    const { product_id } = req.params;
    const result = await pool.query(`
      SELECT r.*, u.username AS rater_username
      FROM user_ratings r
      JOIN users u ON r.rater_user_id = u.id
      WHERE r.product_id = $1 AND r.type='product'
      ORDER BY r.created_at DESC
    `, [product_id]);

    const avg = result.rows.length 
      ? (result.rows.reduce((a,b)=>a+b.rating,0)/result.rows.length).toFixed(1) 
      : 0;

    res.json({avg_rating: avg, ratings: result.rows});
  } catch(err){
    handleServerError(res, err, 'GET /ratings/product/:product_id');
  }
});



app.get('/ratings/seller/:seller_id', async(req,res)=>{
  try{
    const { seller_id } = req.params;
    const result = await pool.query(`
      SELECT r.*, u.username AS rater_username, p.name AS product_name
      FROM user_ratings r
      LEFT JOIN products p ON r.product_id = p.id
      JOIN users u ON r.rater_user_id = u.id
      WHERE r.rated_user_id=$1 AND r.type='seller'
      ORDER BY r.created_at DESC
    `,[seller_id]);

    const avg = result.rows.length ? (result.rows.reduce((a,b)=>a+b.rating,0)/result.rows.length).toFixed(1) : 0;
    res.json({avg_rating:avg, ratings:result.rows});
  }catch(err){handleServerError(res,err,'GET /ratings/seller/:seller_id');}
});



// ------------------
// INICIO SERVIDOR
// ------------------
const PORT = process.env.PORT || 4000;
initDb().then(() => {
  app.listen(PORT, () => console.log(`🚀 NatMarket API lista en http://localhost:${PORT}`));
});
