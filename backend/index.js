
const express = require('express'),
app = express(),
passport = require('passport'),
port = process.env.PORT || 80,
cors = require('cors'),
cookie = require('cookie')
const bcrypt = require('bcrypt')
const db = require('./database.js')
let gundams = db.Gundams
let users = db.users
let user = {}
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
router.route('/userlogin')
    .get((req, res) => {
        res.json(user)
    });
router.route('/gundam')
    .get((req, res) => {
        console.log(gundams)
        res.json(gundams)
    })
    .post((req, res) => {
        console.log(req.body)
        if (!req.body.name || !req.body.type || !req.body.Story  || !req.body.Createuser)
            console.log("Cannot Add with empty string")
        else{ 
        let newgundam = {}
        newgundam.id = (gundams.Gundams.length)?gundams.Gundams[gundams.Gundams.length - 1].id + 1:1
        newgundam.name = req.body.name
        newgundam.type= req.body.type
        newgundam.Story= req.body.Story
        newgundam.classgundam= +req.body.classgundam
        newgundam.Createuser = req.body.Createuser
        gundams = { "Gundams": [...gundams.Gundams, newgundam] }
        res.json(gundams)}
    })
router.route('/gundam/:Gundam_ID')
    .get((req, res) => {
        let Gundam_ID = req.params.Gundam_ID
        let ID = gundams.Gundams.findIndex((item)=> +item.id === +Gundam_ID)
        console.log(gundams.Gundams[ID])
        res.json(gundams.Gundams[ID])
    })
    .put((req, res) => {
        let Gundam_ID = req.params.Gundam_ID ;
        let id = gundams.Gundams.findIndex(item => +item.id === +Gundam_ID)
        gundams.Gundams[id].name = (req.body.name) ? req.body.name : gundams.Gundams[id].name
        gundams.Gundams[id].type= (req.body.type) ? req.body.type : gundams.Gundams[id].type
        gundams.Gundams[id].Story= (req.body.Story) ? req.body.Story : gundams.Gundams[id].Story
        gundams.Gundams[id].classgundam= (req.body.classgundam) ? req.body.classgundam : gundams.Gundams[id].classgundam
        res.json(gundams)
    })
    .delete((req, res) => {
        let Gundam_ID = req.params.Gundam_ID 
        gundams.Gundams = gundams.Gundams.filter(item => +item.id !== +Gundam_ID)
        res.json(gundams.Gundams)
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
    console.log("logout =>" + user.username)
    user = {}
    console.log(user)
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
        user = req.user;
        console.log(user)
        res.send(user)
    });
//Change information 
router.route('/profile/:User_Id',passport.authenticate('jwt', { session: false }))
    
    .put((req, res, next) => {
        const userId = req.params.User_Id ;
        let id = users.users.findIndex(item => +item.id === +userId)
        users.users[id].username = (req.body.username) ? req.body.username : users.users[id].username
        users.users[id].email= (req.body.email) ? req.body.email : users.users[id].email
        res.json(users)
    })
    .delete((req, res, next) => {
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
            if (!username || !email || !password )
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

