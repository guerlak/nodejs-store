const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const dbconn = require('./util/dbconnection');
const mongoDbSession = require('connect-mongodb-session');
const MongoDbSessionStorage = mongoDbSession(session);
const multer = require('multer');

const User = require('./models/user')

//View Token protection
const csrf = require("csurf");
const csrfProtection = csrf();

//Messages saved on session req 
const flash = require('connect-flash')();

//DB configuration to Save sessions
const sessionStorage = new MongoDbSessionStorage({
    uri: "mongodb+srv://guerlak:aloha99@cluster01-p5wzr.mongodb.net/test?retryWrites=true",
    collection: 'sessions'
})

const errorController = require('./controllers/error');
const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'images')
    },
    filename: (req, file ,cb) => {
        cb(null, + Date.now() + '-' + file.originalname )
    }
});

const fileFilter = (req, file, cb) => {
    console.log(file);
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('imageFile'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({
    secret: 'mySecretSession',
    resave: false,
    saveUninitialized: false,
    store: sessionStorage
}));

app.use(csrfProtection);
app.use(flash);

app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
    User.findUserById(req.session.user._id)
    .then(user => {
        if(!user){
            return next();
        }
        req.user = user;
        console.log("Active session user:")
        console.log(user.name);
        next();
    })
    .catch(err => {
        next(new Error(err))
    })
})

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedin;
    res.locals.csrfToken = req.csrfToken()
    
    if(req.user){
        res.locals.isAdmin = req.user.isAdmin;
    }else{
        res.locals.isAdmin= false;
    }
    next();
})


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

//Needs to put this middleware after the session
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(userRoutes.getUser);

app.use(errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
    console.log(error)
    res.redirect('/500');
})

// MYSQL2 PACKAGE
//const db = require('./util/dbconnection')

// db.execute("select * from products ")
//     .then(res => (
//         console.log(res)
//     ))
//     .catch(err => {
//         console.log(err);
//     });

dbconn.mongoConn((function() {
    app.listen(3000);
    })
);

