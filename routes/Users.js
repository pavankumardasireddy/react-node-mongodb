var express = require('express')
var router = express.Router()
var db = require('../db');
var dotEnv = require("dotenv");
dotEnv.load();

//Register User
router.route("/register")
 
    //Inserting the data
    .post((req, res) => {
       var newUser = new db.userDetails(req.body);
        newUser.save()
            .then((userDetails) => {
                res.status(200).send({ userDetails: userDetails });
            })
            .catch((err) => {
                res.status(500).send(err);
            })
    })

    //Retrieving the data
    .get((req, res) => {
        db.userDetails.find({})
            .then((userDetails) => {
                res.status(200).send(userDetails)
            })
            .catch((err) => {
                res.status(500).send(err)
            })
    })

router.route("/:id")

    //Updating the data
    .put((req, res) => {
        db.userDetails.findById(req.params.id, (err, userDetails) => {
            userDetails.name = req.body.name;
            userDetails.email = req.body.email;
            userDetails.password = req.body.password;
            userDetails.confirmPassword = req.body.confirmPassword;
            userDetails.save()

        }).then((userDetails) => {
            db.userDetails.findById(req.params.id, (err, userDetails) => {
                res.status(200).send(userDetails)
            })

        })
            .catch((err) => {
                res.status(500).send(err)
            })
    })

    //Deleting the data
    .delete((req, res) => {
        db.userDetails.findByIdAndRemove({ _id: req.params.id }).
            then((userDetails) => {
                db.userDetails.find({})
                    .then((userDetails) => {
                        res.status(200).send(userDetails)
                    })
            })
            .catch((err) => {
                res.status(500).send(err)
            })
    })

    router.route('/')
   .get((req, res) => {
       db.userDetails.find({})
           .then((users) => {
               res.status(200).send(users);
           })
           .catch((err) => {
               res.status(500).send(err);
           });
   });

//Login User
router.route("/login")

    //Inserting the data
    .post((req, res) => {
        db.userDetails.findOne({ name: req.body.name }).then((userDetails) => {
            console.log('testing' + JSON.stringify(userDetails));
            if (!userDetails) return res.status(404).send('No user found');
            //check password matches
            if (userDetails.password == req.body.password) {
                userDetails.status = "Success";
                res.status(200).send(userDetails);
            } else {
                res.status(404).send('Invalid Password');
            }
        })
            .catch((err) => {
                res.status(500).send(err);
            });
    });
module.exports = router;