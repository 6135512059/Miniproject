
const express = require('express'),
app = express(),
passport = require('passport'),
port = process.env.PORT || 80,
cors = require('cors'),
cookie = require('cookie')
const bcrypt = require('bcrypt')
const db = require('./database.js')
let users = db.users
let Userlist = {
    users: []
}
require('./passport.js')
const router = require('express').Router(),
    jwt = require('jsonwebtoken')

app.use('/api', router)
router.use(cors({ origin: 'http://localhost:3000', credentials: true }))
// router.use(cors())
router.use(express.json())
router.use(express.urlencoded({ extended: false }))

router.route('/user',passport.authenticate('jwt', { session: false }))
    .get((req, res, next) => {
        let Userlist = users.users.findIndex(item => +item.id === 3)
        console.log(Userlist)
        res.json(Userlist)
    });
router.route('/class/:Class_id',passport.authenticate('jwt', { session: false }))
    .get((req, res, next) => {
        const Class_id = req.params.Class_id ;
        let id= users.users.findIndex(item => +item.id === +Class_id)
        console.log(users.users[id].classuser)
        res.json(users.users[id].classuser)
    });
router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        console.log('Login: ', req.body, user, err, info)
        if (err) return next(err)
        if (user) {
            const token = jwt.sign(user, db.SECRET, {
                expiresIn: req.body.remember === 'on'? '7d':'1d'
            })
            // req.cookie.token = token
            res.setHeader(
                "Set-Cookie",
                cookie.serialize("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    maxAge: 60 * 60,
                    sameSite: "strict",
                    path: "/",
                })
            );
            res.statusCode = 200
            return res.json({ user, token })
        } else
            return res.status(422).json(info)
    })(req, res, next)
})

router.get('/logout', (req, res) => { 
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: -1,
            sameSite: "strict",
            path: "/",
        })
    );
    res.statusCode = 200
    return res.json({ message: 'Logout successful' })
})

/* GET user profile. */
router.get('/profile',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        res.send(req.user)
    });
//Change information 
router.route('/profile/:User_Id',passport.authenticate('jwt', { session: false }))
    
    .put((req, res, next) => {
        const userId = req.params.User_Id ;
        let id = users.users.findIndex(item => +item.id === +userId)
        users.users[id].username = req.body.username
        users.users[id].email= req.body.email
        res.json(users)
    })
    .delete((req, res, next) => {
        const userId = req.params.User_Id 
        users.users = users.users.filter(item => +item.id !== +userId)
        res.json(users)
    });
router.delete('/profile/:User_Id',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        const userId = req.params.User_Id 
        users.users = users.users.filter(item => +item.id !== +userId)
        res.json(users)
    });
router.post('/register',
    async (req, res) => {
        try {
            const SALT_ROUND = 10
            const { username, email, password } = req.body 
            const classuser = 1
            if (!username || !email || !password || !classuser)
                return res.json( {message: "Cannot register with empty string"})
            if (db.checkExistingUser(username) !== db.NOT_FOUND)
                return res.json({ message: "Duplicated user" })

            let id = (users.users.length) ? users.users[users.users.length - 1].id + 1 : 1
            hash = await bcrypt.hash(password, SALT_ROUND)
            console.log(hash)
            console.log("Class =>" + classuser)
            users.users.push({ id, username, password: hash, email ,classuser})
            console.log(users.users)
            res.status(200).json({ message: "Register success" })
        } catch {
            res.status(422).json({ message: "Cannot register" })
        }
    })

router.get('/alluser', (req,res) =>{
    Userlist.users = users.users.filter(item => +item.id !== 3)
    console.log(Userlist)
    res.json(Userlist)
})

router.get('/', (req, res, next) => {
    res.send('Respond without authentication');
});

// Error Handler
app.use((err, req, res, next) => {
    let statusCode = err.status || 500
    res.status(statusCode);
    res.json({
        error: {
            status: statusCode,
            message: err.message,
        }
    });
});

// Start Server
app.listen(port, () => console.log(`Server is running on port ${port}`))

