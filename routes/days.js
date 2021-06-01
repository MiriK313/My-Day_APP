const express = require('express')
const Day = require('../models/day')
const router = express.Router()
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'miriuser123@gmail.com',
        pass: 'MiriUser123!'
    }
});

//new day creation page
router.get('/new', (req, res) => {
    res.render('days/new', { day: new Day() })
})

//editing day page by id
router.get('/edit/:id', async(req, res) => {
    const day = await Day.findById(req.params.id)
    res.render('days/edit', { day: day })
})

//read more by slug from db
router.get('/:slug', async(req, res) => {
    const day = await Day.findOne({ slug: req.params.slug })
    if (day == null) res.redirect('/')
    res.render('days/show', { day: day })
})

//post a new day in db
router.post('/', async(req, res, next) => {
    req.day = new Day()
    next()
}, saveDayAndRedirect('new'))

//email day description to 'miriuser123@gmail.com'- can be changed to any email or multiply it
router.post('/email/:id', async(req, res) => {
    const day = await Day.findById(req.params.id)
    const mailOptions = {
        from: 'miriuser123@gmail.com',
        to: 'miriuser123@gmail.com',
        subject: day.title,
        text: day.description
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        }
        res.render('days/email')
    });
})

//editing an existing day in db
router.put('/:id', async(req, res, next) => {
    req.day = await Day.findById(req.params.id)
    next()
}, saveDayAndRedirect('edit'))

//delete day from db
router.delete('/:id', async(req, res) => {
    await Day.findByIdAndDelete(req.params.id)
    res.redirect('/')
})


//save new/existing day and redirect after request
function saveDayAndRedirect(path) {
    return async(req, res) => {
        let day = req.day
        day.title = req.body.title
        day.description = req.body.description
        try {
            day = await day.save()
            res.redirect('/')
        } catch (e) {
            res.render(`days/${path}`, { day: day })
        }
    }
}

module.exports = router