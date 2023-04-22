const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
mngConnect = mongoose.connect('mongodb://127.0.0.1:27017/appleCareDB');

const {Phones, Macbooks, Ipads, Series, AirPods, Accessories, CheckedOut} = require('./db/db.js');
const {anyObj} = require('./db/fetch.js');
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
    let virtualSelectedProduct = [];
    // 1. get all Data of data[type], where type could be [iphone, ipad, macbook, series, homepod,...etc.]     
    try{
        virtualSelectedProduct = await anyObj({model:type}, virtualSelectedProduct, 'view');
        if(!virtualSelectedProduct) throw Error (`Couldn't find data`);
        // 2. After getting relevant Data, return only the version of the products
            // the versions could be [s, s-plus, xs-max, pro, pro, s-plus, pro-max, etc.] 
            // ...and hence remove duplicates from the versions list        
            const getDocVersions = virtualSelectedProduct.map(dev => dev.version);
            let eachDocVersion = new Set(getDocVersions);
            eachDocVersion = [...eachDocVersion];

        // 3. send both version [s, s-plus, xs-max, pro, pro-max, etc.] and type [ipad, macbook, series, ipod,...etc.] to render page
        res.render('stocks/devices', {eachDocVersion, type})
    }
    catch(err) {
        console.log(err.message);
    }      
})

app.get('/product/:sku', async (req, res) => {
    const {sku} = req.params;
    const {model} = req.query;

    let virtualSelectedProduct = [];
    const query = {model:sku, version:model};

    // 1. We get sku & model from url. sku = [se, 5, 8, 14, series, ipad, macbook, ...etc.]
        // ...model = ['', pro-max, plus, s-plus, air, mini,...etc.]
   
    // 2. Search database using the following filter document.model = sku && document.version = model
    try{
        virtualSelectedProduct = await anyObj(query, virtualSelectedProduct, 'view');
        if(!virtualSelectedProduct) throw Error (`Couldn't find data`);
        // 3. render page
        // res.send(virtualSelectedProduct)
        res.render('stocks/checkout', {virtualSelectedProduct})
    }
    catch(err) {
        console.log(err.message);
    }
})

app.post('/insert/:target', async (req, res) => {
    const {target} = req.params;
    const validData = req.body;
    const getSize = new Map(Object.entries(validData));
    const err = [];
    getSize.forEach((v, k) => {
        if(k === 'version' || k === 'bh' || k === 'color') return;
        (v.length === 0) && err.push(k)
    })
    // push to database using target 
    if(getSize.size === 0 || err.length > 0){
        res.send('Empty Data')
        return;
    }
    let theDate = new Date().toISOString();
    if(target === 'accessories'){
        let {product_type, quantity:newQty} = validData;
        const query = {product_type: product_type};
        const prodRes = await Accessories.find(query);
        if(prodRes.length === 0){
            // no product type found
            Accessories(validData).save();
        }
        else{
            // product type found
            const {quantity} = prodRes[0];
            newQty = (+newQty) + quantity;
            await Accessories.findOneAndUpdate(query, {quantity:newQty});
        }
        res.send('saved');
        return;
    }
    [validData.date_added, validData.time_added] = theDate.split('T');
    switch (target){
        case 'phones':
            schVal = Phones(validData).save();
            break;
        case 'macbook':
            schVal = Macbooks(validData).save();
            break;
        case 'ipad':
            schVal = Ipads(validData).save();
            break;
        case 'series':
            schVal = Series(validData).save();
            break;
        case 'airpod':
            schVal = AirPods(validData).save();
            break;
        default:
            schVal = [];
            break;
    };
    schVal.then(() =>{
        res.send('saved')
    });
})


app.get('/data/:id', async (req, res) => {
    const {id} = req.params;
    let virtualSelectedProduct = [];
    const query = {_id: new ObjectId(id)}
    try{
        virtualSelectedProduct = await anyObj(query, virtualSelectedProduct, 'view');
        if(!virtualSelectedProduct) throw Error (`Couldn't find data`);
        const [singleProduct] = virtualSelectedProduct;
        res.send(singleProduct)
    }
    catch(err) {
        console.log(err.message);
    }
})

app.get('/sections/:type', async (req, res) => {
    const {type} = req.params;
    let schVal = [];
    const action = type;
    switch (action){
        case 'phones':
            schVal = Object.keys(Phones.schema.obj);
            break;
        case 'macbook':
            schVal = Object.keys(Macbooks.schema.obj);
            break;
        case 'ipad':
            schVal = Object.keys(Ipads.schema.obj);
            break;
        case 'series':
            schVal = Object.keys(Series.schema.obj);
            break;
        case 'airpod':
            schVal = Object.keys(AirPods.schema.obj);
            break;
        case 'accessories':
            schVal = Object.keys(Accessories.schema.obj);
            break;
        default:
            schVal = [];
            break;
    }
    res.send(schVal);
})
app.patch('/edit', async (req, res) => {
    const updatedData = req.body;
    const {id} = req.body;
    const ething = [Phones, Macbooks, Ipads, Series, AirPods];
    ething.reduce(async (previous, value) => {
        await previous;
        const val = await value.findOneAndUpdate({_id:id}, updatedData, {new:true});
        return new Promise(res => {
            let x = '';
            if(val) x = val;
            res(x)
        });
    }, Promise.resolve()).then(() => {
        res.send('edited')
    })
})

app.post('/sell', async (req, res)=>{
    let {cname, cphone, cdate, ctime, payment, cnote, cident, methodRatio} = req.body;
    const idPrice = cident.split('-');
    let [id, price] = idPrice;
    price = +price;

    let virtualSelectedProduct = [];
    const query = {_id: new ObjectId(id)}
    try{
        virtualSelectedProduct = await anyObj(query, virtualSelectedProduct, 'view');
        if(!virtualSelectedProduct) throw Error (`Couldn't find data`);
        const [singleProduct] = virtualSelectedProduct;
        const checkOutData = {
            customer_name: cname.toLowerCase(),
            customer_phone: cphone,
            payment_method: payment,
            note: cnote.toLowerCase(),
            amount: price,
            quantity: 1,
            total_paid: price,
            check_time: ctime,
            check_date: cdate ,
            method_ratio: methodRatio
        }
        const originalDataPlusOut = Object.assign({}, singleProduct, checkOutData);
        const checkOutDevice = new CheckedOut(originalDataPlusOut);
        checkOutDevice.save().then(async function(){
            // now delete product from database
            let soldRes;
            try{
                soldRes = await anyObj(query, [], 'remove');
                if(!soldRes) throw Error (`Couldn't Sell data`);
                const [finRes] = soldRes;
                // finRes = 'sold'
                res.send(finRes);
            }
            catch(err) {
                console.log(err.message);
            }
        });
    }
    catch(err) {
        console.log(err.message);
    }
})
// STOCKS SECTION


// SALES SECTION
app.get('/sales', (req, res) => {
    res.render('sales/dashboard')
})

app.get('/accounts', (req, res) => {
    res.render('sales/accounts')
})

app.post('/checkout', async (req, res) => {
    const accessData = req.body;
    const allAccessories = [];
    const prdErr = [];
    // console.log(Object.keys(accessData));
    Object.keys(accessData).forEach(async model => {
        let [quant, price, note, payment_method, customer_details, date, ...payRate] = accessData[model];

        const whatPrd = model.toLowerCase();
        console.log(whatPrd);
        let combo = [];
        switch (whatPrd) {
            case 'type c full set (2 pins)':
                combo = ['type c cord', 'type c head (2-pins)'];
                break;
            case 'type c full set (3 pins)':
                combo = ['type c cord', 'type c head (3-pins)'];
                break;
            case 'usb full set (2 pins)':
                combo = ['usb cord', 'usb head (2-pins)'];
                break;
            case 'usb full set (3 pins)':
                combo = ['usb cord', 'usb head (3-pins)'];
                break;
            default:
                break;
        }
        // console.log(combo);
        if(combo.length === 2){
            // product is a set
            combo.forEach(async section => {
                const itemRes = await Accessories.find({product_type: section});
                console.log(section + ' => ' + itemRes);
                if(itemRes.length === 0 || itemRes[0].quantity === 0){
                    console.log(`${whatPrd} out of Stock`);
                }
                // ((itemRes.length === 0 || itemRes[0].quantity === 0)) && prdErr.push(`${section} out of Stock`);
            });
        }

        else{
            // single product
            const findPrd = await Accessories.find({product_type : whatPrd});
            if(findPrd.length === 0 || findPrd[0].quantity === 0){
                console.log(`${whatPrd} out of Stock`);
                // prdErr.push(`${whatPrd} out of Stock`)
            }
        }



        // let method_ratio = {};
        // payRate.forEach(rate => {
        //     for(let [k,v] of Object.entries(rate)){
        //         method_ratio[k] = v;
        //     }
        // })
        // customer_details = customer_details.toLowerCase();
        // note = note.toLowerCase();
        // const [check_date, check_time] = date.split('T');
        // const amount = +price;
        // const quantity = +quant;
        // const total_paid = +quantity * amount;
        // const productData = {model, quantity, amount, note, payment_method, method_ratio, customer_details, total_paid, check_time, check_date};
        // allAccessories.push(productData);
    })
    // console.log(prdErr);
    // CheckedOut.insertMany(allAccessories).then(() => {
    //     res.send('sold')
    // }).catch(err => {
    //     res.send('unable')
    // })
    
})

app.get('/sold/:date', async (req, res) => {
    const {date} = req.params;
    const dateData = CheckedOut.find({check_date:date})
    const docLen = await CheckedOut.countDocuments({check_date:date});
    
    if(docLen){
        if(req.query?.act){
            const amountData = await dateData.then(function(allData){
                return allData.map(eachDoc => eachDoc.total_paid)
            });
            const totalAmount = amountData.reduce((a,b) => a+b,0)
            res.send({totalAmount})
        }
        else{
            let allPrdSold = await dateData.then((allData) => {
                return allData.map(eachDoc => eachDoc.model);
            })
            const uniqModels = new Set(allPrdSold);
            const soldPrds = [...uniqModels];
            const mapPrds = [];
            const holPrds = await soldPrds.reduce(async (prv, val) => {
                await prv;
                const prdDocs = await CheckedOut.find({model:val,check_date:date});
                mapPrds.push(prdDocs)
                return new Promise(res => {
                    res(mapPrds);
                });
            }, Promise.resolve());
            const mapRes = new Map();
            holPrds.forEach((arr, k) => {
                mapRes.set(soldPrds[k], arr)
            })
            const allObj = {};
            mapRes.forEach((v, k) => {
                v.forEach(e => {
                    let type = k;
                    if(type.length <= 2){
                        type = 'phones';
                    }
                    if(!allObj[type]){
                        allObj[type] = [];
                    }
                    allObj[type].push(e);
                })
            });

            const mapedData = new Map(Object.entries(allObj));
            const fullPrdDetails = new Map();
            let cash = 0;
            let momo = 0;
            mapedData.forEach((v, k) => {
                let initQty = 0;
                let mapTotal = 0;
                v.forEach(e => {
                    mapTotal +=e.total_paid;
                    initQty += e.quantity;
                    ((e.payment_method === 'cash') && (cash += +e.method_ratio.cash)) || ((e.payment_method === 'momo') && (momo += +e.method_ratio.momo)) || ((e.payment_method === 'split') && (((momo += +e.method_ratio.momo) || 1) && (cash += +e.method_ratio.cash)))
                });
                fullPrdDetails.set(k, {quantity: initQty, totalAmt: mapTotal});
            });
            const soldObj = {cash, momo};
            fullPrdDetails.forEach((v,k) => soldObj[k] = v);
            res.send(soldObj);
        }
    }
    else{
        res.send({data: 'none'});
    }
})

app.get('/search', (req, res) => {
    res.render('sales/search')
})


app.get('/fetch/:searchItem', async (req, res) => {
    const {query:queryString} = req.query;
    const {searchItem} = req.params;
    let query = {};
    switch (searchItem) {
        case 'imei':
            // query = {imei: {$regex: `/${queryString}/`}};
            query = {imei: queryString};
            break;
        case 'serial':
            query = {serial:queryString};
            break;
        case 'customer':
            query = {$or: [{customer_name:queryString}, {customer_phone:queryString}, {customer_details:queryString}]};
            break;
        case 'date':
            query = {$or:[{date_added:queryString}, {check_date:queryString}]};
            break;
        default:
            break;
    }
    try{
        let virtualSelectedProduct = [];
        virtualSelectedProduct = await anyObj(query, virtualSelectedProduct, 'search');
        res.send(virtualSelectedProduct)
    }
    catch(err){
        console.log(err.message);
    }
    // res.send(query);
})


// SALES SECTION



app.get('*', (req, res) => {
    res.redirect('/')
})

app.listen(3000, () => {
    console.log('Server started on port 3000');
})