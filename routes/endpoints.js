let express = require('express');
let passport = require('passport');
let router = express.Router();

const Owner = require('../models/details');

router.get('/',passport.authenticate('jwt', { session: false }) , (req,res)=>{
    const {email} = req.user;
    Owner.findOne({email})
        .then(detail =>{
            res.json(detail);
        })
        .catch(err => {
            console.log('email not found')
        })
})

router.post('/add' , passport.authenticate('jwt' , {session : false}) , (req,res)=>{
    Owner.findOne({email:req.user.email})
        .then(item => {
            if(!item){
                const newItem = new Owner({
                    email : req.user.email,
                    subjects  : [req.body]
                })
                newItem.save()
                    .then(item => {
                        console.log(item)
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                res.json(item);
            }else{
                console.log('first item is added')
                const subs = [...item.subjects , req.body];
                Owner.updateOne({email: req.user.email} , {subjects : subs} , (err , res)=>{
                    if(err)
                    console.log(err);
                })
                res.json(item.subjects);
            }
        })
})

router.patch('/delete/:id',passport.authenticate('jwt',{session:false}) , (req,res)=>{
    const id = req.params.id;
    Owner.findOne({email : req.user.email})
        .then(item => {
            let subjects = item.subjects;
            var newSubs = subjects.filter(sub => sub._id != id)
            Owner.updateOne({email : req.user.email} , {subjects: newSubs} , (err,res)=>{
                if(err)
                console.log(err);
            })
            res.json({subjects : newSubs});
        })
})

router.post('/edit/:id',passport.authenticate('jwt',{session: false}) , (req,res)=>{
    const id  = req.params.id;
    const newItem = req.body;
    Owner.findOne({email : req.user.email})
        .then(item => {
            let subs = item.subjects;
            for(let i=0;i<subs.length;i++){
                if(subs[i]._id == id){
                    console.log('sub found...??>?')
                    subs[i].subject = newItem.subject;
                    subs[i].minPer = newItem.minPer;
                    subs[i].clsAtt = newItem.clsAtt;
                    subs[i].totCls = newItem.totCls;
                    break;
                }
            }
            Owner.updateOne({email : req.user.email} , {subjects  : subs} , (err,res)=>{
                if(err)
                console.log(err);
            })
            res.json({subjects : subs});
        })
})

module.exports = router;