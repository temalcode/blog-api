//express
const express = require('express');
const app = express();
//dotenv
const dotenv = require('dotenv');
dotenv.config();
// mongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, () => console.log('connected to the database'));

app.get('/', function (req, res){
    res.status(200).send('Medium Clone - NodeJS Backend API');
})

//routes
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/posts', postRoutes);
app.use('/users', userRoutes);

//404
app.get("*", function(req, res){
    res.status(404).send('resource not found');
})

app.listen(process.env.PORT || 5000, () => console.log('server is started'));