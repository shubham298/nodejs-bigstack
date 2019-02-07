const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../setup/myurl");

//@type     GET
//@route    /api/auth
//@desc     just for testing
//@access   PUBLIC
router.get("/", (req, res) => res.json({ test: "Auth is success" }));

//Import Schema for Person to Register
const Person = require("../../models/Pearson.js");

//@type     POST
//@route    /api/auth/register
//@desc     route for registration of users
//@access   PUBLIC

router.post("/register", (req, res) => {
  Person.findOne({ email: req.body.email }) //first query to find that user has already register
    .then(person => {
      if (person) {
        return res
          .status(400)
          .json({ emailerror: "Email is already registered in our system" });
      } else {
        const newPerson = new Person({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        //encrypt the password using bcrypt

        const saltRounds = 10;
        const myPlaintextPassword = newPerson.password;

        bcrypt.genSalt(saltRounds, (err, salt) => {
          bcrypt.hash(myPlaintextPassword, salt, (err, hash) => {
            // Store hash in your password DB.
            if (err) throw err;
            newPerson.password = hash;
            newPerson
              .save()
              .then(person => res.json(person))
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(err => console.log(err));
});

//@type     POST
//@route    /api/auth/login
//@desc     route for login of users
//@access   PUBLIC
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  Person.findOne({ email }) //findOne is a mongodb query
    .then(person => {
      if (!person) {
        return res
          .status(404)
          .json({ emailerror: "User not found with this email" });
      }
      bcrypt.compare(password, person.password).then(isCorrect => {
        if (isCorrect) {
          //   success: "User is able to login successfully"
          //use payload and create token for user

          //after creating token , data will be encoded so we will use extracter and extract the data  from the token
          const payload = {
            id: person.id,
            name: person.name,
            email: person.email
          };
          jsonwt.sign(
            payload,
            key.secret,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          res.status(400).json({ passworderror: "Password is not correct" });
        }
      });
    })
    .catch(err => console.log(err));
});

//@type     GET
//@route    /api/auth/profile
//@desc     route for  user profile
//@access   PRIVATE
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req);
  }
);
module.exports = router;
