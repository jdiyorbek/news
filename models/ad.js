const mongoose = require("mongoose")

const adSchema = new mongoose.Schema({
    url: String,
    view: Number,
})

const Ad = mongoose.model("Ad", adSchema)

module.exports = Ad;