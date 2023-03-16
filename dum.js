'use strict';


const arr = [1, 2, 2, 1, 1, 3, 4, 4];
const doarr = new Set(arr);
console.log(doarr);




// let total = 275;
// let cash = 1;
// let momo = 274;

// const prds = [
//     // {item: 'charger', price: 150, cash: 0, momo: 0},
//     // {item: 'handsfree', price: 125, cash: 0, momo: 0},
// ];

// prds.forEach(item => {
//     total -= item.price;
//     if(cash >= item.price){
//         cash -= item.price;
//         item.cash = item.price;
//     }
//     else{
//         item.cash = cash;
//         // item.momo = item.price - cash;
//         cash -= item.cash;
//     }
// })

// console.log(prds);









// const obj = {
//     name: 'John',
//     age: 30
// }
// const doLoop = Object.entries(obj);
// doLoop.forEach(([x,y], k) => {
//     console.log(x);
// })
// const data = [1, 2, 3, 4, 5];
// data.reduce(async (prev, value) => {
//     await prev;
//     // Return new promise
//     console.log(value);
//     let hey = 5;
//     return new Promise((resolve) => {
//         // let hey;
//         // console.log(value);
//         let x = 1;
//         if(value === 2){
//             x = hey;
//         }

//         resolve(x);
//     });
// }, Promise.resolve()).then((e) => {
//     console.log('loop finished');
//     console.log(e);
// });

// const data = {
//     "2023-02-29" : {
//         phones : [
//             {
//                 quantity : '1',
//                 amt: '50'
//             },
//             {
//                 quantity : '1',
//                 amt: '50'
//             },
//             {
//                 quantity : '5',
//                 amt: '50'
//             }
//         ],
//         charger : [
//             {
//                 quantity : '4',
//                 amt: '100'
//             },
//             {
//                 quantity : '5',
//                 amt: '100'
//             },
//             {
//                 quantity : '1',
//                 amt: '100'
//             }
//         ],
//     }
// }

// const keys = Object.keys(data["2023-02-29"]);
// const prdMap = new Map();
// keys.forEach(key => {
//     let allQty = 0;
//     let allAmt = 0;
//     data["2023-02-29"][key].forEach(obj => {
//         allQty += +obj.quantity;
//         allAmt += +obj.amt;
//     });
//     prdMap.set(key, {quantity: allQty, totalAmt: allAmt});
// })
// console.log(prdMap);
// prdMap.forEach(v => {
//     console.log(v.quantity);
// })



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