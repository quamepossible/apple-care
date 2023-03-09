const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/appleCareDB');
mongoose.pluralize(null);


const phoneSchema = mongoose.Schema({
    model: String,
    version: String,
    imei: String,
    storage: String,
    bh: String,
    color: String,
    price: Number,
    dateAdded: Date
})

const otherProductSchema = mongoose.Schema({
    model : String,
    version : String,
    year : String,
    serial : String,
    storage : String,
    RAM : String,
    processor : String,
    color : String,
    price : String,
    size : String,
    touchbar : String,
    display : String,
    dateAdded : Date
})

const Phones = mongoose.model('phones', phoneSchema);
const Macbooks = mongoose.model('macbooks', otherProductSchema)
const Ipads = mongoose.model('ipads', otherProductSchema)
const Series = mongoose.model('series', otherProductSchema)
module.exports = {Phones, Macbooks, Ipads, Series};