import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import customerRoutes from './routes/customer.routes.js';
import productRoutes from './routes/product.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import cartRoutes from './routes/cart.routes.js';
import  cookieParser from 'cookie-parser';

dotenv.config({ path: './backend/.env' });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/cart', cartRoutes);

const port = process.env.PORT || 8000;
const mongoUri = process.env.MONGO_URI;

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'ShopKart backend is running'
    });
});

mongoose
    .connect(mongoUri)
    .then(() => {
        console.log('MongoDB connected successfully');

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((error) => {
        console.log('MongoDB connection failed:', error.message);
    });
