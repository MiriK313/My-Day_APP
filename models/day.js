const mongoose = require('mongoose')
    //converts id to url address
const slugify = require('slugify')


const daySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true //only one slug to each
    },
})

//create slug out of title
daySchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }

    next()
})
module.exports = mongoose.model('Day', daySchema)