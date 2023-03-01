'use strict';

const data = {
    "2023-02-29" : {
        phones : [
            {
                quantity : '1',
                amt: '50'
            },
            {
                quantity : '1',
                amt: '50'
            },
            {
                quantity : '5',
                amt: '50'
            }
        ],
        charger : [
            {
                quantity : '4',
                amt: '100'
            },
            {
                quantity : '5',
                amt: '100'
            },
            {
                quantity : '1',
                amt: '100'
            }
        ],
    }
}

const keys = Object.keys(data["2023-02-29"]);
const prdMap = new Map();
keys.forEach(key => {
    let allQty = 0;
    let allAmt = 0;
    data["2023-02-29"][key].forEach(obj => {
        allQty += +obj.quantity;
        allAmt += +obj.amt;
    });
    prdMap.set(key, {quantity: allQty, totalAmt: allAmt});
})
console.log(prdMap);
prdMap.forEach(v => {
    console.log(v.quantity);
})



// const theDate = new Date().toISOString().split('T')[0];
// const mainDateKeys = Object.keys(data);
// const prdType = 'phones';
// const prdData = {imei : '829329', price : '199'};
// const isDateKeyAva = mainDateKeys.some(k => k === theDate);
// if(!isDateKeyAva){
//     // we've not saved any data for this date
//     // so create object for this date
//     data[theDate] = {}
//     // create a new array for the product type
//         // and insert data into product array
//     data[theDate][prdType] = [prdData];
// }
// else{
//     // we have saved data for this date
//     // just identify the product type
//         // and insert data in product type array
    
//     // get the keys(product types) in the date
//     const dateKeys = Object.keys(data[theDate])
//     const isPrdKeyAva = dateKeys.some(k => k === prdType);
    
//     // if isPredKeyAva = false, it means we've not saved any product of this type
//         // on this date
//     if(!isPrdKeyAva) { //=> isPredKeyAva = false
//         // so add product to date object
//         data[theDate][prdType] = [prdData];
//     }
//     else{ // we've already save a product of this type
//         data[theDate][prdType].push(prdData)
//     }
// }


// console.log(data);