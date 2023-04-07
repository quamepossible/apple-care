const mongoose = require('mongoose');
mngConnect = mongoose.connect('mongodb://127.0.0.1:27017/appleCareDB');

const anyObj = async function (query, virtualSelectedProduct, action) {
    return new Promise ((res, _) => { 
        mngConnect.then(async function(){
            // connect mongoose to database using default mongo driver
            const db = mongoose.connection.db;

            // get list of all collections
            const allCollections = await db.listCollections().toArray();

            // now, loop through all
            allCollections.reduce(async function(prev, collection){
                await prev;
                // we'll  get each collection name from here
                // const collectionSize = await db.collection(collection.name).countDocuments(query);
                if(action !== 'search' && collection.name === 'checkedout') return; // we don't want to loop through this collection

                if(action === 'remove'){
                    await db.collection(collection.name).deleteOne(query).then((resp) => {
                        if(resp.deletedCount === 1) virtualSelectedProduct.push('sold');
                    });
                }

                if(action === 'view' || action === 'search'){
                    const individualCollection = db.collection(collection.name).find(query);
                    await individualCollection.forEach(doc => {
                        virtualSelectedProduct.push(doc);
                    })
                } 
                return new Promise(resolve => {
                    resolve(virtualSelectedProduct);
                })
            }, Promise.resolve()).then(e => res(e));
        })
    })
}
module.exports = {anyObj};