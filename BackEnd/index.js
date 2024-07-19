const express = require('express');
const app = express();
const cors = require('cors');
const fileupload = require('express-fileupload');
require('dotenv').config();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));

// Database Connection
require('./config/database').connectDB();

// Cloudinary Connection
require('./config/cloudinary').cloudinaryConnect();

// app.use(logReqRes('log.txt'));

// Routes 
const userRoutes = require('./router/userRoute');
const medicineInfoRoutes = require('./router/medicineInfoRoute');
const orderRoutes = require('./router/orderRoute');
const categoryRoutes = require('./router/categoryRoute');
const typeRoutes = require("./router/typeRoute");
const logRoutes = require("./router/logRoute");

app.use('/api/v1', userRoutes);
app.use('/api/v1', medicineInfoRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', typeRoutes);
app.use('/api/v1', logRoutes);

app.listen(PORT, () => {
    console.log(`Server Started at PORT ${PORT}`);
});
