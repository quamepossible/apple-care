const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');
const path = require('path');
// const data = require('./db/data.json');
const mongoose = require('mongoose');
mngConnect = mongoose.connect('mongodb://127.0.0.1:27017/appleCareDB');

const {Phones, Macbooks, Ipads, Series} = require('./db/db.js');
const anyObj = require('./db/fetch.js');
const checkOutData = require('./db/checkout.json');
const app = express();

// set views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/'));


// middleware
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'static/')));
app.use(methodOverride('_method'));
app.use(cors());

app.get('/', (req, res) => {
    res.render('home');
})


// STOCKS SECTION
app.get('/sections', (req, res) => {
    res.render('stocks/sections')
})


// this route is where i've listed only all iphone models
app.get('/products/:type', (req, res) => {
    const {type} = req.params;
    res.render('stocks/products', {type})
})


// this route list all products of a specific type (eg: ipad, macbook, series...etc.)
// this route also accepts a query string (?categ=7/8/SE) when searching for phones
    // thus url/devices/phones?categ=SE (lists all iphone SE models)
app.get('/devices/:type', async (req, res) => {
    const {type} = req.params;
    const {categ}  = req.query;
    // console.log(type);
    if(categ && categ !== 'phones') return;

    let virtualSelectedProduct = [];
    // 1. Check if url contains "?categ=phones" string...
    //     a. if yes, get all Data of data[categ]. where 'categ' is always = 'phone' and type is [5, 6, 7, 13, 14,...etc.]
    //     b. Else, get all Data of data[type], where type could be [ipad, macbook, series, ipod,...etc.]
        if(categ) {
            // user clicked on phone
            virtualSelectedProduct = await Phones.find({model:type});
        }

        else{      
            try{
                virtualSelectedProduct = await anyObj({model:type}, virtualSelectedProduct);
                if(!virtualSelectedProduct) throw Error (`Couldn't find data`)
            }
            catch(err) {
                console.log(err.message);
            }
        }       
        // console.log(virtualSelectedProduct);    
    
    // 2. After getting relevant Data, return only the version of the products
        // the versions could be [s, s-plus, xs-max, pro, pro, s-plus, pro-max, etc.] 
        // ...and hence remove duplicates from the versions list        
        const getDocVersions = virtualSelectedProduct.map(dev => dev.version);
        let eachDocVersion = new Set(getDocVersions);
        eachDocVersion = [...eachDocVersion];

    // 3. send both version [s, s-plus, xs-max, pro, pro-max, etc.] and type [ipad, macbook, series, ipod,...etc.] to render page
        res.render('stocks/devices', {eachDocVersion, type})
})

app.get('/product/:sku', async (req, res) => {
    const {sku} = req.params;
    const {model} = req.query;
    let type = (sku.length <= 2) ? 'phones' : sku;
    // const devices = data[type].filter(d => (d.model === sku && d.version === model))
    // console.log("devices " + devices.length);
    // res.render('stocks/checkout', {devices})
    let virtualSelectedProduct = [];
    const query = {model:sku, version:model};
    // hard coded algorithm
    // 1. We get sku & model from url. sku = [se, 5, 8, 14, series, ipad, macbook, ...etc.]
        // ...model = ['', pro-max, plus, s-plus, air, mini,...etc.]
        
    // 2. if sku.length <= 2 (it means) product is a phone
        // ...and hence, type = 'phones'
        if(type === 'phones'){
            virtualSelectedProduct = await Phones.find(query);
        }

        // else type = 'series' or 'ipad' or 'macbook'
        else{    
        // 3. Search database using the following filter document.model = sku && document.version = model
            try{
                virtualSelectedProduct = await anyObj(query, virtualSelectedProduct);
                if(!virtualSelectedProduct) throw Error (`Couldn't find data`)
            }
            catch(err) {
                console.log(err.message);
            }
        }   


    // 4. render page
    res.render('stocks/checkout', {virtualSelectedProduct})
})

app.post('/insert/:target', (req, res) => {
    const {target} = req.params;
    const validData = req.body;
    const getSize = new Map(Object.entries(validData));
    const err = [];
    getSize.forEach((v, k) => (k !== 'version') && (v.length === 0) && err.push(k))
    // push to database using target
    if(!data[target]){
        res.send('Invalid Product');
        return;
    } 
    if(getSize.size === 0 || err.length > 0){
        res.send('Empty Data')
        return;
    }
    validData.dateAdded = new Date().toISOString();
    data[target].push(validData);
    console.log(validData);
    res.send('saved')
})

const getSingleDevice = (id) => {
    // put data properties into Map
    const dataProp = new Map(Object.entries(data));
    const dataPropNames = [];
    dataProp.forEach((_, k) => dataPropNames.push(k));
    for(const i of dataPropNames){
        const getItem = data[i].find(dev => (dev?.imei === id || dev?.serial === id));
        if(getItem) return [getItem, i];
    }
}

const checkoutDevice = (date, prdType, prdData) => {
    // const theDate = new Date().toISOString().split('T')[0];
    const theDate = date;
    const mainDateKeys = Object.keys(checkOutData);
    const isDateKeyAva = mainDateKeys.some(k => k === theDate);
    if(!isDateKeyAva){
        checkOutData[theDate] = {}
        checkOutData[theDate][prdType] = [prdData];
    }
    else{
        const dateKeys = Object.keys(checkOutData[theDate])
        const isPrdKeyAva = dateKeys.some(k => k === prdType);
        (!isPrdKeyAva) ? checkOutData[theDate][prdType] = [prdData] : checkOutData[theDate][prdType].push(prdData)
    }
    return true;
}

app.get('/data/:id', (req, res) => {
    const {id} = req.params;
    res.send(getSingleDevice(id)[0]);
})

app.get('/sections/:type', (req, res) => {
    const {type} = req.params;
    const oneType = data[type][0];
    const grapKeysMap = new Map(Object.entries(oneType));
    const holKeys = [];
    grapKeysMap.forEach((_, k) => {
        if(k === 'img' || k === 'dateAdded') return;
        holKeys.push(k)
    })
    res.send(holKeys);
})

app.patch('/edit', (req, res) => {
    const updatedData = req.body;
    console.log(updatedData);
    const mapGetData = new Map(Object.entries(updatedData));
    const err = [];
    mapGetData.forEach((v, k) => (k !== 'version') && (v.length === 0) && err.push(k))
    if(mapGetData.size === 0 || err.length > 0){
        res.send('Empty Data')
        return;
    }
    const id = (updatedData?.imei) ? updatedData.imei : updatedData.serial;
    const serOrime = (updatedData?.imei) ? 'imei' : 'serial';
    console.log(`${serOrime} : ${id}`);
    const dataProp = new Map(Object.entries(data));
    // put data properties into Map
    const dataPropNames = [];
    dataProp.forEach((_, k) => dataPropNames.push(k));
    for(const i of dataPropNames){
        const getItem = data[i].find(dev => (dev?.imei === id || dev?.serial === id));
        if(getItem){
            console.log(i);
            // i = phones, macbook, ipad, series
            const removeData = data[i].filter(dev => dev[serOrime] !== id);
            data[i] = removeData;
            data[i].push(updatedData);
            res.send('edited')
        }
        else{
            // res.send('Device not found')
        }
    }
})

app.post('/sell', (req, res)=>{
    const {cident, cdate} = req.body;
    const devData = getSingleDevice(cident);
    const devOriginalData = devData[0];
    const totalAmt = +devOriginalData.price; 
    const newCheckOutData = Object.assign({}, devOriginalData, {quantity: '1', totalAmt}, req.body);
    const doCheckout = checkoutDevice(cdate, devData[1], newCheckOutData);
    if(doCheckout){
        // remove device from main database
        data[devData[1]] = data[devData[1]].filter(d => !(d?.imei === cident || d?.serial === cident));
        res.send(checkOutData);
    }
    console.log(checkOutData);
})
// STOCKS SECTION


// SALES SECTION
app.get('/sales', (req, res) => {
    res.render('sales/dashboard')
})

app.get('/accounts', (req, res) => {
    res.render('sales/accounts')
})

app.post('/checkout', (req, res) => {
    const accessData = req.body;
    Object.keys(accessData).forEach(k => {
        const [quantity, price, note, payment, date] = accessData[k];
        const justDate = date.split('T')[0];
        const totalAmt = +quantity * +price;
        const productData = {quantity, price, note, payment, totalAmt};
        checkoutDevice(justDate, k, productData);
    })
    console.log(checkOutData);
    res.send(checkOutData)
})

app.get('/sold/:date', (req, res) => {
    const {date:theDate} = req.params;
    if(Object.keys(checkOutData).some(k => k===theDate)){
        if(req.query?.act) {
            let totalAmount = 0;
            const dateData = Object.values(checkOutData[theDate]);
            dateData.forEach(row => row.forEach(purchase => totalAmount += purchase.totalAmt))
            console.log(totalAmount);
            res.send({totalAmount});
        }
        else{
            const datePrds = Object.keys(checkOutData[theDate]);
            const prdMap = new Map();
            let cash = 0;
            let momo = 0;
            datePrds.forEach(prd => {
                let allQty = 0;
                let allAmt = 0;
                // console.log(prd);
                checkOutData[theDate][prd].forEach(obj => {
                    console.log(obj);
                    allQty += +obj.quantity;
                    allAmt += obj.totalAmt;
                    (obj.payment === 'cash') ? cash += +obj.totalAmt : momo += +obj.totalAmt;
                })
                prdMap.set(prd, {quantity: allQty, totalAmt: allAmt});
            });
            const soldObj = {cash, momo};
            prdMap.forEach((v,k) => soldObj[k] = v);
            console.log(soldObj);
            console.log(`Cash : ${cash}`);
            console.log(`Momo : ${momo}`);
            res.send(soldObj);
        }
    }
    else{
        res.send({data: 'none'})
        console.log('no data found');
    }    
})



// SALES SECTION



app.get('*', (req, res) => {
    res.redirect('/')
})

app.listen(3000, () => {
    console.log('Server started on port 3000');
})