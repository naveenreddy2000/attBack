const express = require('express');
let router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

//const validateRegisterInput = require('../validator/register');
//const validateLoginInput = require('../validator/login');

const User = require('../models/users');

router.post("/register", (req, res) => {
  
    /*const { errors, isValid } = validateRegisterInput(req.body);
  
    if (!isValid) {
      return res.status(400).json(errors);
    }*/
  
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.json({ success: false, message: "Email already exists" });
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json({success: true, message: ""}))
              .catch(err => console.log(err));
          });
        });
      }
    });
  });


  router.post("/login", (req, res) => {
    /*const { errors, isValid } = validateLoginInput(req.body);
  
    if (!isValid) {
      return res.status(400).json(errors);
    }*/
  
    const email = req.body.email;
    const password = req.body.password;
  
    User.findOne({ email }).then(user => {
      if (!user) {
        res.json({ message: "Email not found",status : false,token:'' });
      }else{
        bcrypt.compare(password, user.password).then(isMatch => {
          if (isMatch) {
            const payload = {
              id: user.id,
              name: user.name,
              email: user.email
            };
    
            jwt.sign(
              payload,
              'secret',
              {
                expiresIn: 360000
              },
              (err, token) => {
                res.json({
                  message:'successfully logged in',
                  status: true,
                  token: "Bearer " + token
                });
              }
            );
          } else {
            res
              .json({ message: "Password incorrect",status:false,token:'' });
          }
        });
      }
    });
  });

module.exports = router;