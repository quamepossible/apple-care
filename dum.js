'use strict';

const data = {
    "2023-02-29" : {
        phones : [
            {
                imei : '8383298',
                price : '100'
            }
        ],
    }
}
const theDate = new Date().toISOString().split('T')[0];
const mainDateKeys = Object.keys(data);
const prdType = 'phones';
const prdData = {imei : '829329', price : '199'};
const isDateKeyAva = mainDateKeys.some(k => k === theDate);
if(!isDateKeyAva){
    // we've not saved any data for this date
    // so create object for this date
    data[theDate] = {}
    // create a new array for the product type
        // and insert data into product array
    data[theDate][prdType] = [prdData];
}
else{
    // we have saved data for this date
    // just identify the product type
        // and insert data in product type array
    
    // get the keys(product types) in the date
    const dateKeys = Object.keys(data[theDate])
    const isPrdKeyAva = dateKeys.some(k => k === prdType);
    
    // if isPredKeyAva = false, it means we've not saved any product of this type
        // on this date
    if(!isPrdKeyAva) { //=> isPredKeyAva = false
        // so add product to date object
        data[theDate][prdType] = [prdData];
    }
    else{ // we've already save a product of this type
        data[theDate][prdType].push(prdData)
    }
}


console.log(data);

// const prdType = 'phones'
// const pData = {
//     imei : '18238',
//     price: '30'
// }
// const allKeys = Object.keys(data);
// const isKeyAva = allKeys.some(k => k === prdType);
// (!isKeyAva) ? data[prdType] = [pData] : data[prdType].push(pData)

// console.log(data);
