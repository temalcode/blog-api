//express
const express = require('express');
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
//model
const userModel = require('../models/users');
//bcrypt
const bcrypt = require('bcrypt');
//jwt
const jwt = require('jsonwebtoken');
//dotenv
const dotenv = require('dotenv');
dotenv.config();

//signup
router.post('/signup', async function (req, res) {
    try {
        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        let newUser = new userModel({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword
        });
        let savedUser = await newUser.save();
        let {password, ...otherDetails} = savedUser.toJSON()
        res.status(200).send(otherDetails)
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//login
router.post('/login', async function (req, res) {
    try {
        let userProfile = await userModel.findOne({ username: req.body.username });
        if (userProfile != null) {
            bcrypt.compare(req.body.password, userProfile.password, function (err, result) {
                if(err){
                    return res.status(400).send(err.message);
                }
                if (result) {
                    let jwtToken = jwt.sign({ "username": userProfile.username }, process.env.JWT_SECRET, { expiresIn: 1000 * 60 * 60 });
                    res.cookie('token', jwtToken, { httpOnly: true });
                    res.status(200).send('logged successfully');
                } else {
                    res.status(400).send('password is incorrect');
                }
            });
        } else {
            res.status(400).send('username is not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;