const express = require('express')
const Recipe = require('../models/recipe')
const router = express.Router()
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mirikrihely@gmail.com',
        pass: 'Mk313531089'
    }
});


router.get('/new', (req, res) => {
    res.render('recipes/new', { recipe: new Recipe() })
})

router.get('/edit/:id', async(req, res) => {
    const recipe = await Recipe.findById(req.params.id)
    res.render('recipes/edit', { recipe: recipe })
})

router.get('/:slug', async(req, res) => {
    const recipe = await Recipe.findOne({ slug: req.params.slug })
    if (recipe == null) res.redirect('/')
    res.render('recipes/show', { recipe: recipe })
})

router.post('/', async(req, res, next) => {
    req.recipe = new Recipe()
    next()
}, saveRecipeAndRedirect('new'))

//nofar0729@gmail.com
router.post('/email/:id', async(req, res) => {
    const recipe = await Recipe.findById(req.params.id)

    const mailOptions = {
        from: 'mirikrihely@gmail.com',
        to: 'mirikrihely@gmail.com',
        subject: recipe.title,
        text: recipe.description
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        }
        res.render('recipes/email')
    });
})


router.put('/:id', async(req, res, next) => {
    req.recipe = await Recipe.findById(req.params.id)
    next()
}, saveRecipeAndRedirect('edit'))

router.delete('/:id', async(req, res) => {
    await Recipe.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveRecipeAndRedirect(path) {
    return async(req, res) => {
        let recipe = req.recipe
        recipe.title = req.body.title
        recipe.description = req.body.description
        recipe.markdown = req.body.markdown
        try {
            recipe = await recipe.save()
            res.redirect(`/recipes/${recipe.slug}`)
        } catch (e) {
            res.render(`recipes/${path}`, { recipe: recipe })
        }
    }
}

module.exports = router