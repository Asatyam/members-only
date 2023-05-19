const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/user');
const Message = require('./models/message');

const mongoDb = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.zomngs9.mongodb.net/members_only?retryWrites=true&w=majority`;
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

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));



app.get('/',(req,res)=>{
    res.send("Hello World");
});

app.get('/sign-up',(req,res)=>{
    res.render('sign-up');
})
app.post("/sign-up",async(req,res,next)=>{
    bcryptjs.hash(req.body.password,10,async(err,hashedPassword)=>{
        if(err){
            res.send(err);
        }
        try{
            const user = new User({
                username: req.body.username,
                password: hashedPassword,
            });
            const result = await user.save();
            res.redirect('/');
        }catch(err){
            return next(err);
        }
        
    })
})








app.listen(3000,()=>{console.log("App is listening on port 3000")});