const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Mock users (password: admin123/user123)
const users = [
  {
    id: 1,
    email: 'admin@example.com',
    password: '$2a$10$amOoEqutrmUgTJpYQV44J.VRd6fa0cKiJ2qVE0L14l/SV1dRyMVy.',
    // password: 'admin123',
    name: 'Admin User',
    roles: ['admin', 'user']
  },
  {
    id: 2,
    email: 'user@example.com',
    password: '$2a$10$5QDqlOUMfC2wjqfeQBdzcumnD/NXIsLS3ndikdjCFOZ2k/1wEtui.',
    name: 'Regular User',
    roles: ['user']
  }
];

app.use('/api/auth', require('./routes/auth'));
app.use('/api/protected', require('./routes/protected'));

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.locals.users = users;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});