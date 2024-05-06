const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./config/db');

const path = require('path');
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use('/api', userRoutes);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.listen(PORT, ()=> {
    console.log(`Server is running on PORT: ${PORT}`);
})