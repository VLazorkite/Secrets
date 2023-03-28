require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { mongoose, Schema } = require("mongoose");
<<<<<<< HEAD
// const md5 = require('md5');
const bcrypt = require('bcrypt');
=======
const md5 = require('md5');
// const bcrypt = require('bcrypt');
>>>>>>> df7d565f81401d02cd01d1f090df099f93d349c7
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
const saltRounds = parseInt(process.env.SALTROUNDS);

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
    newUser(user);
    res.render("secrets")
});
app.post('/login', async (req, res) => {
    let user = req.body;
    let confirm = await verifyUser(user);
    if (confirm) {
        res.render("secrets");
    } else {
        res.redirect('/login');
    }
})

//functions
function newUser(user) {
<<<<<<< HEAD
    bcrypt.hash(user.password, saltRounds,function(err, hash) {
        const newUser = new User({
            username: user.username,
            password: hash
        })
        User.create(newUser);
    });
=======
    const newUser = new User({
        username: user.username,
        password: md5(user.password)
    })
    User.create(newUser);
>>>>>>> df7d565f81401d02cd01d1f090df099f93d349c7
}
async function verifyUser(logger) {
    let accessor = await find(logger.username);
    let result = bcrypt.compare(logger.password, accessor[0].password);
    if (accessor == null) {
        console.log('User not found');
<<<<<<< HEAD
    } else if(result){
=======
        return false
    } else if(md5(logger.password) == accessor[0].password){
        return true;
>>>>>>> df7d565f81401d02cd01d1f090df099f93d349c7
    } else {
        console.log("incorrect password");
    }
    return result;


}
async function find(username) {
    return await User.find({ username: username });
}