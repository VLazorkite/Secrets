require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { mongoose, Schema } = require("mongoose");
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport =require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
    secret: "A special secret",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.URI);


const userSchema = new Schema({
    username: String,
    password: String
})

userSchema.plugin(passportLocalMongoose);

// mongoose.set("useCreateIndex", true);

const User = new mongoose.model("User", userSchema);
const saltRounds = parseInt(process.env.SALTROUNDS);

passport.serializeUser(User.serializeUser());
passport.use(User.createStrategy());
passport.deserializeUser(User.deserializeUser());

//get methods
app.listen(3000, () => {
    console.log("We're up");
});
app.get('/', (req,res) => {
    res.render("home");
});
app.get('/login', (req,res) => {
    res.render("login");
});
app.get('/register', (req,res) => {
    res.render("register");
});
app.get('/logout', (req,res) => {
    req.logout();
    res.redirect("/login");
});
app.get('/submit', (req,res) => {
    res.render("submit");
});
app.get('/secrets', (req,res) => {
    if (req.isAuthenticated()) {
        res.render("secrets");
    }else{
        res.redirect("/login");
    }
});

//post methods
app.post('/register', (req, res) => {
    let nUser = req.body;
    // newUser(user);
    User.register({username: nUser.username}, nUser.password, (err, user)=>{
        if (err) {
            console.log(err);
            res.redirect('/register');
        } else{
            passport.authenticate('local')(req, res, function () {
                res.redirect("/secrets");
            });
        }
    })
});
app.post('/login', async (req, res) => {
    let user = req.body;
    const newUser = new User({
        username: user.username,
        password: user.password
    });
    // let confirm = await verifyUser(user);
    // if (confirm) {
    //     res.render("secrets");
    // } else {
    //     res.redirect('/login');
    // }
    req.login(newUser, (err)=>{
        if(err){
            console.log(err);
            res.redirect('/login');
        }else{
            passport.authenticate('local')(req, res, function () {
                res.redirect("/secrets");
            });
        }
    })
})

//functions
function newUser(user) {
    bcrypt.hash(user.password, saltRounds,function(err, hash) {
        const newUser = new User({
            username: user.username,
            password: hash
        })
        User.create(newUser);
    });
}
async function verifyUser(logger) {
    let accessor = await find(logger.username);
    let result = bcrypt.compare(logger.password, accessor[0].password);
    if (accessor == null) {
        console.log('User not found');
    } else if(!result){
        console.log("incorrect password");
    }
    return result;


}
async function find(username) {
    return await User.find({ username: username });
}
