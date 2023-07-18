const mongoose = require("mongoose");

const anyObj = async function (query, virtualSelectedProduct, action) {
  return new Promise((res, _) => {
    mongoose
      .connect(
        "mongodb+srv://young-k:xXHOXLSUCZ37CElb@cluster0.swt0arz.mongodb.net/appleCareDB?retryWrites=true&w=majority"
      )
      .then(async function () {
        // connect mongoose to database using default mongo driver
        const db = mongoose.connection.db;

        // get list of all collections
        const allCollections = await db.listCollections().toArray();
        // console.log(allCollections);

        // now, loop through all
        for (const collection of allCollections) {
          // we'll  get each collection name from here
          if (action !== "search" && collection.name === "checkedout") continue;

          if (action === "remove") {
            db.collection(collection.name)
              .deleteOne(query)
              .then((resp) => {
                if (resp.deletedCount === 1)
                  virtualSelectedProduct.push("sold");
              });
          }

          if (action === "view" || action === "search") {
            const individualCollection = db
              .collection(collection.name)
              .find(query);
            await individualCollection.forEach((doc) => {
              virtualSelectedProduct.push(doc);
            });
          }
        }
        console.log("This side is not running");
        console.log(virtualSelectedProduct);

        res(virtualSelectedProduct);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
};
module.exports = { anyObj };
