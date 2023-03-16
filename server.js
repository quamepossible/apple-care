const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');
const path = require('path');
// const data = require('./db/data.json');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
mngConnect = mongoose.connect('mongodb://127.0.0.1:27017/appleCareDB');

const {Phones, Macbooks, Ipads, Series, AirPods, CheckedOut} = require('./db/db.js');
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
    // console.log(virtualSelectedProduct);    
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
    // console.log(virtualSelectedProduct);
})

app.post('/insert/:target', (req, res) => {
    const {target} = req.params;
    console.log('target => ' + target);
    const validData = req.body;
    const getSize = new Map(Object.entries(validData));
    const err = [];
    getSize.forEach((v, k) => (k !== 'version') && (v.length === 0) && err.push(k))
    // push to database using target
    // if(!data[target]){
    //     res.send('Invalid Product');
    //     return;
    // } 
    if(getSize.size === 0 || err.length > 0){
        res.send('Empty Data')
        return;
    }
    validData.dateAdded = new Date().toISOString();
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
    }
    schVal.then(() =>{
        console.log(`${target} added to products`);
        res.send('saved')
    })
    // data[target].push(validData);
    // console.log(validData);
    // res.send('saved')
})

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
    console.log(type);
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
        default:
            schVal = [];
            break;
    }
    console.log(schVal);
    res.send(schVal);
})
app.patch('/edit', async (req, res) => {
    const updatedData = req.body;
    const {id} = req.body;
    const ething = [Phones, Macbooks, Ipads, Series, AirPods];
    ething.reduce(async (previous, value) => {
        await previous;
        const val = await value.findOneAndUpdate({_id:id}, updatedData, {new:true});
        return new Promise((resolve) => {
            let x = '';
            if(val) x = val;
            resolve(x)
        });
    }, Promise.resolve()).then((e) => {
        console.log(e);
        res.send('edited')
    })
})

app.post('/sell', async (req, res)=>{
    const {cname, cphone, cdate, ctime, payment, cnote, cident} = req.body;
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
            customerName: cname,
            customerPhone: cphone,
            paymentMethod: payment,
            note: cnote,
            amount: price,
            quantity: 1,
            totalPaid: price,
            checkTime: ctime,
            checkDate: cdate 
        }
        const originalDataPlusOut = Object.assign({}, singleProduct, checkOutData);
        const checkOutDevice = new CheckedOut(originalDataPlusOut);
        checkOutDevice.save().then(async function(){
            // now delete product from database
            let soldRes;
            try{
                soldRes = await anyObj(query, [], 'remove');
                if(!soldRes) throw Error (`Couldn't Sell data`);
                res.send(soldRes);
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

app.post('/checkout', (req, res) => {
    const accessData = req.body;
    const allAccessories = [];
    console.log(accessData);
    Object.keys(accessData).forEach(model => {
        const [quant, price, note, paymentMethod, customerDetails, date, ...payRate] = accessData[model];
        let methodRatio = {};
        if(payRate.length === 1){
            methodRatio = payRate[0];
        }
        else{
            payRate.forEach(rate => {
                const key = Object.entries(rate)[0][0];
                const val = Object.entries(rate)[0][1];
                methodRatio[key] = val;
            })
        }
        console.log(methodRatio);
        const checkDate = date.split('T')[0];
        const checkTime = date.split('T')[1];
        const amount = +price;
        const quantity = +quant;
        const totalPaid = +quantity * amount;
        const productData = {model, quantity, amount, note, paymentMethod, methodRatio, customerDetails, totalPaid, checkTime, checkDate};
        allAccessories.push(productData);
        CheckedOut(productData).save();
        console.log(productData);
    })
    // const checkOutAcc = new CheckedOut(allAccessories);
    // checkOutAcc.save().then(() => {
    //     console.log('Accessories sold');
    // })
    // console.log(allAccessories);
    // console.log(checkOutData);
    // res.send(checkOutData)
})

app.get('/sold/:date', async (req, res) => {
    const {date} = req.params;
    const dateData = CheckedOut.find({checkDate:date})
    const docLen = await CheckedOut.countDocuments({checkDate:date});
    
    if(docLen){
        res.send('good kay okay');
        // if(req.query?.act){
        //     const amountData = await dateData.then(function(allData){
        //         return allData.map(eachDoc => eachDoc.totalPaid)
        //     });
        //     console.log(amountData);
        //     const totalAmount = amountData.reduce((a,b) => a+b,0)
        //     console.log(totalAmount);
        //     res.send({totalAmount})
        // }
        // else{
        //     let allPrdSold = await dateData.then((allData) => {
        //         return allData.map(eachDoc => eachDoc.model);
        //     })
        //     console.log(allPrdSold);
        //     const uniqModels = new Set(allPrdSold);
        //     const soldPrds = [...uniqModels];
        //     const mapPrds = new Map();
        //     soldPrds.forEach(async (prd) => {
        //         const prdDocs = await CheckedOut.find({model:prd});
        //         // const prdType = (prd.length <= 2) ? 'Phones' : prd;
        //         console.log(prd);
        //         mapPrds.set(prd, prdDocs);
        //     })
        //     console.log(mapPrds);
        //     res.send(uniqModels);
        // }
    }
    else{
        res.send({data: 'none'});
    }
 
    // const dateData = await CheckedOut.find({checkDate:date}).then(function(allData){
    //     return allData.map(eachDoc => eachDoc.totalPaid)
    // });
    // console.log(dateData);

    // const {date:theDate} = req.params;
    // if(Object.keys(checkOutData).some(k => k===theDate)){
    //     if(req.query?.act) {
    //         let totalAmount = 0;
    //         const dateData = Object.values(checkOutData[theDate]);
    //         dateData.forEach(row => row.forEach(purchase => totalAmount += purchase.totalAmt))
    //         console.log(totalAmount);
    //         res.send({totalAmount});
    //     }
    //     else{
    //         const datePrds = Object.keys(checkOutData[theDate]);
    //         const prdMap = new Map();
    //         let cash = 0;
    //         let momo = 0;
    //         datePrds.forEach(prd => {
    //             let allQty = 0;
    //             let allAmt = 0;
    //             // console.log(prd);
    //             checkOutData[theDate][prd].forEach(obj => {
    //                 console.log(obj);
    //                 allQty += +obj.quantity;
    //                 allAmt += obj.totalAmt;
    //                 (obj.payment === 'cash') ? cash += +obj.totalAmt : momo += +obj.totalAmt;
    //             })
    //             prdMap.set(prd, {quantity: allQty, totalAmt: allAmt});
    //         });
    //         const soldObj = {cash, momo};
    //         prdMap.forEach((v,k) => soldObj[k] = v);
    //         console.log(soldObj);
    //         console.log(`Cash : ${cash}`);
    //         console.log(`Momo : ${momo}`);
    //         res.send(soldObj);
    //     }
    // }
    // else{
    //     res.send({data: 'none'})
    //     console.log('no data found');
    // }    
})



// SALES SECTION



app.get('*', (req, res) => {
    res.redirect('/')
})

app.listen(3000, () => {
    console.log('Server started on port 3000');
})