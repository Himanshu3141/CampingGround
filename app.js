const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');

const campgroundRoutes=require('./routes/campgrounds');
const reviewRoutes=require('./routes/reviews')
const userRoutes=require('./routes/users');

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/boilerplate');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

async function main() {
  try {
    const dbUrl = process.env.MONGODB_URL; 

    if (!dbUrl) {
      throw new Error("MongoDB URL is missing from .env file!");
    }

    await mongoose.connect(dbUrl);

    console.log("DATABASE CONNECTED!!");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
}

main();

const sessionConfig={
  secret:'thisshouldbeabettersecret!',
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }
}

app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
  res.locals.User = req.user;  
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use('/',userRoutes)
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes)


app.use('/', async (req, res) => {
  res.render('campgrounds/home', { showNavbar: false }); 
});


app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404));
});


app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).render('error', { message });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
