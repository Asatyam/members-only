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
const {body,validationResult} = require("express-validator");

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

app.use(function (req,res,next){
    res.locals.currentUser = req.user;
    next();
})

app.get('/',(req,res)=>{
    res.render('index',{user:req.user});
});

app.get('/sign-up',(req,res)=>{
    res.render('sign-up');
})
app.post('/sign-up', [
  body('username')
    .trim()
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        return await Promise.reject('Username already taken');
      }
      return true;
    })
    .escape(),
  body('password')
    .trim()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must be of 8 characters with 1 lowercase, 1 uppercase, 1 number and 1 special symbols'
    )
    .escape(),
    body('confirm')
    .trim()
    .custom(async (value,{req}) =>{
        const password = req.body.password;
        if(password !== value)
        {
            throw new Error("Passwords do not match");
        }
        return true;
    })
    .escape()
    ,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      res.render('sign-up', { errors: errors.array() });
      
      return;
    }

    bcryptjs.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        res.send(err);
      }
      try {
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });
         await user.save();
        res.redirect('/');
      } catch (err) {
        return next(err);
      }
    });
  },
]);

app.get('/login',(req,res)=>{
    res.render("login");
})

app.post('/login',[
    body('username')
    .trim()
    .notEmpty()
    .withMessage("Username cannot be empty")
    .escape(),

    body('password')
    .trim()
    .notEmpty()
    .withMessage("Please enter the password")
    .escape(),

    passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/',
    })
]);
app.get("/new-message",(req,res)=>{
    res.render('create-message');
})
passport.use(
    new LocalStrategy(async(username, password, done)=>{
        try{
            const user = await User.findOne({username:username});
            if(!user){
                return done(null, false, {message: "User not found"});
            };
            bcryptjs.compare(password, user.password,(err,res)=>{
                if (res){
                    return done(null, user)
                } else{
                    return done(null, false, {message: "Incorrect password"});
                }
            });
        }
        catch(err){
            return done(err);
        }
    }
    )
)
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});


app.listen(3000,()=>{console.log("App is listening on port 3000")});