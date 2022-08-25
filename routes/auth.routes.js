const router = require("express").Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model')

router.get('/signup', (req,res) => res.render('signup'));

router.post('/signup', (req,res,next) =>  {
    console.log('The form data: ', req.body);
    const {username, email, password} = req.body;

    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
        return User.create({
            username,
            email,
            passwordHash: hashedPassword
        });
    })
    .then(userFromDB => {
        console.log('Newly create user is: ', userFromDB);
        req.session.currentUser = userFromDB;
        res.redirect('/userProfile')
    })
    .catch(error => next(error));
});

router.get('/login', (req,res) => res.render('login'));

router.post('/login', (req,res,next) => {
console.log('SESSION ===>', req.session);
const { username, password } = req.body;

if(username === '' || password === '') {
    res.render('login.hbs', {errorMessage: 'Please enter both username and password.'})
    return;
}
User.findOne({username})
.then(userFound => {
    if (!userFound) {
        res.render('login.hbs', {errorMessage: 'User not found'})
        return;
    } else if(bcryptjs.compareSync(password, userFound.passwordHash)) {
        req.session.currentUser = userFound
        res.redirect('/userprofile');
        return;
    } else {
        res.render('login', {errorMessage: 'Incorrect password.'});
        return;
    }
})
.catch(error => next(error))

});

module.exports = router