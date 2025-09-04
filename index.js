require('dotenv').config();
const express = require('express');
const app = express();
const { syncDatabase } = require('./models');


const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);

syncDatabase(); 

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));