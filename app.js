//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true})

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema);

app.get("/", (req,res) => {
    res.render('home');
})

app.get("/login", (req,res) => {
    res.render('login');
})

app.get("/register", (req,res) => {
    res.render('register');
})

app.post("/register", (req,res) => {
    const userEmail = req.body.username;
    const userPassword = req.body.password;
    const user = new User({email: userEmail, password: userPassword});
    user.save(err => {
        if(err) console.log(err)
        else res.render("secrets");
    })
})

app.post("/login", (req,res) => {
    User.findOne({email: req.body.username, password: req.body.password}, (err) =>{
        if(err) console.log(err)
        else res.render("secrets");
    })
})






app.listen(PORT, () => {
    console.log('Server is running on Port: ', PORT)
})