const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt');
const dotenv = require('dotenv');
const axios = require('axios');
// const bcrypt = require('bcrypt');

dotenv.config();

const app = new Koa();
const router = new Router();

// Your MySQL connection settings
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'your_database',
});

// Middleware
app.use(bodyParser());
app.use(koaJwt({ secret: process.env.JWT_SECRET }).unless({ path: [/^\/login/] }));

// Routes
const dummyUser = {
  id: 1,
  username: 'user',
  password: 'password', // Use a hashed password in production
};

router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;

  // Authenticate user with your database
  // Replace this with your own user authentication logic
  if (username === dummyUser.username && password === dummyUser.password) {
    // If authentication is successful, create and return JWT token
    const token = jwt.sign({ id: dummyUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    ctx.body = { token };
  } else {
    ctx.status = 401;
    ctx.body = { error: 'Invalid username or password' };
  }
});

router.post('/chat', async (ctx) => {
  const { message } = ctx.request.body;

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      prompt: message,
      max_tokens: 50,
      n: 1,
      stop: null,
      temperature: 0.8,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  ctx.body = { response: response.data.choices[0].text };
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
