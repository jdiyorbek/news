const mongoose = require("mongoose")

const articleSchema = new mongoose.Schema({
    title: String,
    description: String,
    text: String,
    type: String,
    view: Number,
    date: Number
})

const Article = mongoose.model("Article", articleSchema)

module.exports = Article