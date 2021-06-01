const express = require('express')
const mongoose = require('mongoose')
const Day = require('./models/day')
const dayRouter = require('./routes/days')
const methodOverride = require('method-override') //allows to create delete functions
const app = express()

//Database connection
mongoose.connect('mongodb://localhost/myDayAppDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true.valueOf,

});

//port
const PORT = 4000;

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

//home page displays all days from db
app.get('/', async(req, res) => {
    const days = await Day.find().sort({ createdAt: 'desc' })
    res.render('days/index', { days: days })
})

app.use('/days', dayRouter)

module.exports = app.listen(PORT)