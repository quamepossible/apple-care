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

const Macbooks = mongoose.model('macbooks', otherProductSchema);
Macbooks.insertMany([
  {
    model : "macbook",
    version : "pro",
    year : "2022",
    serial : "427077700674008",
    storage : "2TB",
    RAM : "16GB",
    processor : "i7",
    color : "silver",
    price : "3222",
    size : "16",
    touchbar : "yes",
    display : "retina",
    img : "/imgs/categ/macbooks/",
    dateAdded : "2023-02-27T13:50:56.643Z"
  },
  {
    model : "macbook",
    version : "air",
    year : "2020",
    serial : "617136623431531",
    storage : "2TB",
    RAM : "16GB",
    processor : "i5",
    color : "silver",
    price : "3222",
    size : "14",
    touchbar : "no",
    display : "LED",
    img : "/imgs/categ/macbooks/",
    dateAdded : "2023-02-27T13:50:56.643Z"
  },
  {
    model : "macbook",
    version : "air",
    year : "2020",
    serial : "527548632387682",
    storage : "2TB",
    RAM : "16GB",
    processor : "M2 pro",
    color : "silver",
    price : "3222",
    size : "14",
    touchbar : "no",
    display : "LED",
    img : "/imgs/categ/macbooks/",
    dateAdded : "2023-02-27T13:50:56.643Z"
  }
]).then(()=> {
  console.log('products saved');
})