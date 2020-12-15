 require('dotenv').config()
 const express = require('express')
 const app = express()
 const ejs = require('ejs')
 const expressLayout = require('express-ejs-layouts')
 const path = require('path')
 const PORT = process.env.PORT || 3000
 const mongoose = require('mongoose')
 const session = require('express-session')
 const flash = require('express-flash')
 const { urlencoded } = require('express')
 const MongoDbStore = require('connect-mongo')(session)
 const passport = require('passport')


 // Database Connection
 const url = 'mongodb://localhost/pizza';
 mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true });
 const connection = mongoose.connection;
 connection.once('open', () => {
     console.log('Database Connected..')
 }).catch(err => {
     console.log('Connection failed..')
 });


 //  Session store (cookies and session store in the databse)
 let mongoStore = new MongoDbStore({
     mongooseConnection: connection,
     collection: 'sessions'
 })





 //Session Config
 app.use(session({
     secret: process.env.COOKIE_SECRET,
     resave: false,
     store: mongoStore,
     saveUninitialized: false,
     cookie: { maxAge: 1000 * 60 * 60 * 24 } //24hours

 }))


 //Passport config
 const passportInit = require('./app/config/passport')
 passportInit(passport)
 app.use(passport.initialize())
 app.use(passport.session())


 //<iidlewares
 app.use(flash())
 app.use(express.json())
 app.use(express.urlencoded({ extended: false }))


 //Assests
 app.use(express.static('public'))

 //Global middlewares
 app.use((req, res, next) => {
     res.locals.session = req.session
     res.locals.user = req.user
     next()
 })

 app.use(expressLayout)
 app.set('views', path.join(__dirname, '/resources/views'))
 app.set('view engine', 'ejs')

 require('./routes/web')(app)



 app.listen(PORT, () => {
     console.log(`Server has started on port ${PORT}`)
 })