const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
require('./config/db');

const path = require('path');
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

//user Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

//product Routes
const productRoutes = require('./routes/productRoutes');
productRoutes.use(bodyParser.json());
productRoutes.use(bodyParser.urlencoded({extended: true}));
app.use('/api', productRoutes);

//add to cart Routes
const cartRoutes = require('./routes/cartRoutes');
cartRoutes.use(bodyParser.json());
cartRoutes.use(bodyParser.urlencoded({extended: true}));
app.use('/api', cartRoutes);

//Buy Product Routes
const buyProductRoutes = require('./routes/buyProductRoutes');
buyProductRoutes.use(bodyParser.json());
buyProductRoutes.use(bodyParser.urlencoded({extended: true}));
app.use('/api', buyProductRoutes);

//For views folder which has ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.listen(PORT, ()=> {
    console.log(`Server is running on PORT: ${PORT}`);
})