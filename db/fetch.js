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
            let count = 1;
            allCollections.forEach(async function(collection, k, arr){
                // we'll  get each collection name from here
                // const collectionSize = await db.collection(collection.name).countDocuments(query);
                if(collection.name === 'checkedout') return; // we don't want to loop through this collection

                if(action === 'remove'){
                    db.collection(collection.name).deleteOne(query).then((resp) => {
                        if(resp.deletedCount === 1) res('sold');
                    });
                }

                if(action === 'view'){
                    const individualCollection = db.collection(collection.name).find(query);
                    // get all Documents of each collection
                    await individualCollection.forEach(doc => {
                        virtualSelectedProduct.push(doc);
                    })
                    // this block ensures all collections are looped through before it sends response
                    if(count === arr.length - 1){
                        res(virtualSelectedProduct)
                    }
                    count++;
                }    
            })
        })
    })
}
module.exports = {anyObj};