const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const ExpressError = require('./utils/ExpressError');
const logger=require("morgan");
const bodyParser = require("body-parser");
let path = require("path");
const flash = require('connect-flash');
const cors = require("cors");
const dotenv=require("dotenv")
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User');
const GeneratedProject = require('./models/Project')


dotenv.config()

//Connect to MongoDB
// console.log(process.env.MONGO_URI);
// mongoose.connect(process.env.MONGO_URI , {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('MongoDB connected');
// }).catch((err) => {
//   console.error('MongoDB connection error:', err);
// });


app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static("public"));

app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(cors({ origin: true }));
app.use(express.static(path.join(__dirname, "public"))); 
 
const sessionConfig = {
    secret: 'innovivesecretsession',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const indexRoute=require("./routes/indexRoute.js")
const authRoute=require("./routes/authRoute.js")
const upload=require("./routes/upload.js")
const enthusiastRoute=require('./routes/enthusiast.js')
const industrialRoute=require('./routes/industrial.js')
const projectRoute=require('./routes/project.js')

app.use("/", indexRoute);
app.use("/auth",authRoute);
app.use("/upload",upload);
app.use("/register-enthusiast",enthusiastRoute)
app.use("/register-industrial",industrialRoute)
app.use("/generate-project", projectRoute)


// app.all('*', (req, res, next) => {
//     next(new ExpressError('Page Not Found', 404))
// })

// app.use((err, req, res, next) => {
//     const { statusCode = 500 } = err;
//     if (!err.message) err.message = 'Oh No, Something Went Wrong!'
//     res.status(statusCode).render('error', { err })
// })

console.log("ENV: ", app.get('env'));
module.exports= app;