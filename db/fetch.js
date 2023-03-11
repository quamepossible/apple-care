const mongoose = require('mongoose');
mngConnect = mongoose.connect('mongodb://127.0.0.1:27017/appleCareDB');

const anyObj = async function (query, virtualSelectedProduct) {
    return new Promise ((res, _) => { 
        mngConnect.then(async function(){
            // connect mongoose to database using default mongo driver
            const db = mongoose.connection.db;

            // get list of all collections
            const allCollections = await db.listCollections().toArray();

            // now, loop through all
            let count = 1;
            allCollections.forEach(async function(collection, k, arr){
                if(collection.name === 'phones') return;

                // we'll  get each collection name from here
                const individualCollection = db.collection(collection.name).find(query);
                const collectionSize = await db.collection(collection.name).countDocuments(query);
                
                // get all Documents of each collection
                await individualCollection.forEach(doc => {
                    virtualSelectedProduct.push(doc);
                })

                // this block ensures all collections are looped through before it sends response
                if(count === arr.length - 1){
                    res(virtualSelectedProduct)
                }
                count++;
            })
        })
    })
}
module.exports = anyObj;