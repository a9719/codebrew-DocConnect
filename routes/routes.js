const axios = require('axios')
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var controller = require('../controller.js');
var Patient= mongoose.model('patient');
var PatientRecords= mongoose.model('Patientrecords');
router.get('/', (req, res) => {

    
        res.render("welcome.ejs");
});
router.get('/signup', function (req, res) {
    res.sendfile("./views/signuppatient.html");


});
router.get('/loginpatient', function (req, res) {
    res.render('loginpatient.ejs')


});
router.post('/credentialspatient', [
    check('email').isEmail().withMessage("Invalid email address"),
    check('password').isLength({ min: 2 }).withMessage("Password must be at least 3 chars long")

],  function(req, res) {

    const errors = validationResult(req);

    if (!errors.isEmpty()){

        let errorMessage = []
        errors.array().map(err => errorMessage.push( err.msg ));

        errorMessage.map(msg => res.write(msg + "\n"));
        res.end();
        return;

        //return res.status(422).json({ errors: errors.array()})

    }

    const userEmail = req.body.email;
    const userPassword = req.body.password;

    Patient.findOne({email:userEmail,password:userPassword}, function(err,user) {
        if (!err  && user!=null) {
            console.log(user);
            req.session.id =user.id;
            req.session.email = user.email;
            req.session.password = user.password;
            req.session.name= user.name;

            res.redirect("/homepagepatient");

        } else {
            res.render("login.ejs", {congr:"",
                congr1: " again, invalid email or password!"
            });

        }
    });

});

router.get('/homepagepatient', function(req,res){

        if (req.session.name){
            res.render("patientprofile.ejs",{
                    name:req.session.name
                }
            );
        } else {
            res.render("welcome.ejs");
        }
    })
router.post('/publishrecord',controller.createDayRecord);

router.post('/patientcreateuser',controller.createPatient);
router.get('/users', controller.findAllUsers);
router.get('/records/:patient', controller.findRecordsByUserId);
router.post('/records/create', controller.createDayRecord);
module.exports = router;