const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const data = require('./db/data.json')
const accessoryData = require('./db/accessory.json')
const app = express();

// set views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/'));


// middleware
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'static/')));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
})


// STOCKS SECTION
app.get('/sections', (req, res) => {
    res.render('stocks/sections')
})

app.get('/products/:type', (req, res) => {
    const {type} = req.params;
    res.render('stocks/products', {type})
})

app.get('/devices/:type', (req, res) => {
    const {type} = req.params;
    const {categ}  = req.query;
    if(categ && categ !== 'phones') return;
    if(!data[type] && categ !== 'phones') return;

    const selected = (categ) ? data[categ].filter(dev => dev.model === type) : data[type];
    const vers = selected.map(dev => dev.version);
    let eachVersion = new Set(vers);
    eachVersion = [...eachVersion];
    res.render('stocks/devices', {eachVersion, type})
})

app.get('/product/:sku', (req, res) => {
    const {sku} = req.params;
    const {model} = req.query;
    let type = (sku.length <= 2) ? 'phones' : sku;

    const devices = data[type].filter(d => (d.model === sku && d.version === model))
    console.log("devices " + devices.length);
    if(devices.length > 0){
        res.render('stocks/checkout', {devices})
    }
    else{
        res.redirect('/sections')
    }
})

app.post('/insert/:target', (req, res) => {
    const {target} = req.params;
    const validData = req.body;
    const getSize = new Map(Object.entries(validData));
    const err = [];
    getSize.forEach((v, k) => {
        if(k !== 'version') v.length === 0 && err.push(k)
    });
    console.log(`Error Length : ${err.length}`);
    // push to database using target
    if(!data[target]){
        res.send('Invalid Product');
        return;
    } 
    if(getSize.size === 0 || err.length > 0){
        res.send('Empty Data')
        return;
    }
    data[target].push(validData);
    console.log(data[target]);
    res.send('saved')
})

app.get('/data/:id', (req, res) => {
    const {id} = req.params;
    const dataProp = new Map(Object.entries(data));
    // put data properties into Map
    const dataPropNames = [];
    dataProp.forEach((_, k) => dataPropNames.push(k));
    console.log(dataPropNames);
    for(const i of dataPropNames){
        const getItem = data[i].find(dev => (dev?.imei === id || dev?.serial === id));
        if(getItem) res.send(getItem);
    }
})

app.get('/sections/:type', (req, res) => {
    const {type} = req.params;
    const oneType = data[type][0];
    const grapKeysMap = new Map(Object.entries(oneType));
    const holKeys = [];
    grapKeysMap.forEach((_, k) => (k !== 'img') && holKeys.push(k))
    console.log(holKeys);
    res.send(holKeys);
})

app.patch('/edit', (req, res) => {
    const updatedData = req.body;
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
            console.log(data[i]);
            res.send('edited')
        }
    }
})
// STOCKS SECTION


// SALES SECTION
app.get('/sales', (req, res) => {
    res.render('sales/index')
})

app.get('/analytics', (req, res) => {
    res.render('sales/analytics')
})

app.post('/checkout', (req, res) => {
    const accessData = req.body;
    const mapData = new Map(Object.entries(accessData));
    mapData.forEach((v, k) => accessoryData[k].push(v));
    res.send(accessoryData);
})

// SALES SECTION






app.get('*', (req, res) => {
    res.redirect('/')
})

app.listen(3000, () => {
    console.log('Server started on port 3000');
})