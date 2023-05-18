const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
require('dotenv').config();


const mongoDb = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.zomngs9.mongodb.net/?retryWrites=true&w=majority`;
mongoose.set('strictQuery', false);
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

const app = express();
// Require static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set 'views' directory for any views 
// being rendered res.render()
app.set('views', path.join(__dirname, 'views'));

// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


app.get('/',(req,res)=>{
    res.send("Hello World");
});

app.get('/sign-up',(req,res)=>{
    res.render('sign-up');
})










app.listen(3000,()=>{console.log("App is listening on port 3000")});