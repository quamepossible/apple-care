const mongoose = require("mongoose");

const anyObj = async function (query, virtualSelectedProduct, action) {
  return new Promise((res, _) => {
    mongoose
      .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.swt0arz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
        )
      .then(async function () {
        // connect mongoose to database using default mongo driver
        const db = mongoose.connection.db;

        if(!db) return;

        // get list of all collections
        const allCollections = await db.listCollections().toArray();
        // console.log(allCollections);

        // now, loop through all
        for (const collection of allCollections) {
          // we'll  get each collection name from here
          if (action !== "search" && collection.name === "checkedout") continue;

          if (action === "remove") {
            await db.collection(collection.name)
              .deleteOne(query)
              .then((resp) => {
                console.log(resp.deletedCount);
                if (resp.deletedCount === 1) {
                  virtualSelectedProduct.push("sold");
                  res(virtualSelectedProduct)
                }
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
        res(virtualSelectedProduct);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
};
module.exports = { anyObj };
