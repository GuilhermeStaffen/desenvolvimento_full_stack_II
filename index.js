const express = require('express');
const app = express();
const { syncDatabase } = require('./models');

const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

syncDatabase(); 

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));