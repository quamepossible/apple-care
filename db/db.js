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

const podSchema = mongoose.Schema({
    model : String,
    version: String,
    color: String,
    dateAdded: String,
    price: String
})


const checkoutSchema = mongoose.Schema({
    ...otherProductSchema.obj,
    customerName: {
        type: String,
        default: 'N/A'
    },
    customerPhone: {
        type: String,
        default: 'N/A'
    },
    paymentMethod: String,
    methodRatio: Object,
    note: String,
    amount: Number,
    quantity: Number,
    totalPaid: Number,
    checkTime: String,
    checkDate: String,
})


const Phones = mongoose.model('phones', phoneSchema);
const Macbooks = mongoose.model('macbooks', otherProductSchema);
const Ipads = mongoose.model('ipads', otherProductSchema);
const Series = mongoose.model('series', otherProductSchema);
const AirPods = mongoose.model('airpods', podSchema)
const CheckedOut = mongoose.model('checkedout', checkoutSchema);
module.exports = {Phones, Macbooks, Ipads, Series, AirPods, CheckedOut};