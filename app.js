//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const e = require('express');
const saltRounds = 10;

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
    bcrypt.hash(userPassword, saltRounds, function(err, hash) {
        if(err) {
            console.log(err)
        } else {
            const user = new User({email: userEmail, password: hash});
            user.save(error => {
                if(error) console.log(error)
                else res.render("secrets");
            })
        }
    })
})

app.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err, foundUser) =>{
        if(err) {console.log(err)} 
        else {
            if(foundUser) {
                bcrypt.compare(password, foundUser.password, (err, result) => {
                    if(result) {
                        res.render("secrets")
                    } else {
                        if(err) {console.log(err)}
                    }
                })
            }
            
        };
    })
})






app.listen(PORT, () => {
    console.log('Server is running on Port: ', PORT)
})