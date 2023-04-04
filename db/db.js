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
    time_added: String,
    date_added: String
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
    time_added: String,
    date_added : Date
})

const podSchema = mongoose.Schema({
    model : String,
    version: String,
    color: String,
    date_added: String,
    price: String
})


const checkoutSchema = mongoose.Schema({
    ...otherProductSchema.obj,
    imei: String,
    customer_name: {
        type: String,
        default: 'N/A'
    },
    customer_phone: {
        type: String,
        default: 'N/A'
    },
    customer_details: String,
    payment_method: String,
    method_ratio: Object,
    note: String,
    amount: Number,
    quantity: Number,
    total_paid: Number,
    check_time: String,
    check_date: String,
})


const Phones = mongoose.model('phones', phoneSchema);
const Macbooks = mongoose.model('macbooks', otherProductSchema);
const Ipads = mongoose.model('ipads', otherProductSchema);
const Series = mongoose.model('series', otherProductSchema);
const AirPods = mongoose.model('airpods', podSchema)
const CheckedOut = mongoose.model('checkedout', checkoutSchema);
module.exports = {Phones, Macbooks, Ipads, Series, AirPods, CheckedOut};