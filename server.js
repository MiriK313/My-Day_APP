const express = require('express')
const mongoose = require('mongoose')
const Recipe = require('./models/recipe')
const recipeRouter = require('./routes/recipes')
const methodOverride = require('method-override') //allows to create delete functions
const app = express()


mongoose.connect('mongodb://localhost/recipesDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})


const PORT = 8000;

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async(req, res) => {
    const recipes = await Recipe.find().sort({ createdAt: 'desc' })
    res.render('recipes/index', { recipes: recipes })
})

app.use('/recipes', recipeRouter)

module.exports = app.listen(PORT)