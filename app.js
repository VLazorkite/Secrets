
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { mongoose, Schema } = require("mongoose");
const md5 = require('md5');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.URI);

const userSchema = new Schema({
    username: String,
    password: String
})

const User = new mongoose.model("User", userSchema);

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
    res.render("home");
});
app.get('/submit', (req,res) => {
    res.render("submit");
});

//post methods
app.post('/register', (req, res) => {
    let user = req.body;
    // console.log(user);
    newUser(user);
    res.render("secrets")
});
app.post('/login', async (req, res) => {
    let user = req.body;
    // console.log(user);
    let confirm = await verifyUser(user);
    if (confirm) {
        res.render("secrets");
    } else {
        res.redirect('/login');
    }
})

//functions
function newUser(user) {
    const newUser = new User({
        username: user.username,
        password: md5(user.password)
    })
    User.create(newUser);
}
async function verifyUser(logger) {
    let accessor = await find(logger.username);
    // console.log(accessor);

    if (accessor == null) {
        console.log('User not found');
        return false
    } else if(md5(logger.password) == accessor[0].password){
        return true;
    } else {
        console.log("incorrect password");
        return false;
    }
}
async function find(username) {
    return await User.find({ username: username });
}