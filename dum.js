'use strict';

const mainData = {
    model: "6",
    version: "s",
    imei: "944872856530972"
}
const subData = {
    data: "2023-02-19",
    version: 'sp'
}

const newData = Object.assign({}, mainData, subData);
console.log(newData);