require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const swaggerDocs = require("./config/swagger");
const { syncDatabase } = require('./models');

// habilita CORS para qualquer origem
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const supplierRoutes = require('./routes/suppliers');
const adminDashboardRoutes = require('./routes/adminDashboard');

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/admin', adminDashboardRoutes);

syncDatabase(); 
swaggerDocs(app);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));