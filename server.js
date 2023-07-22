const express = require("express");
const cors = require("cors");
const methodOverride = require("method-override");
const path = require("path");
const ObjectId = require("mongodb").ObjectId;

const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://young-k:xXHOXLSUCZ37CElb@cluster0.swt0arz.mongodb.net/appleCareDB?retryWrites=true&w=majority"
);

const {
  Phones,
  Macbooks,
  Ipads,
  Series,
  AirPods,
  Accessories,
  CheckedOut,
} = require("./db/db.js");
const { anyObj } = require("./db/fetch.js");
const { clearLine } = require("readline");
const app = express();
const PORT = process.env.PORT || 3003;

// set views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/"));

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static/")));
app.use(methodOverride("_method"));
app.use(cors());

app.get("/", (req, res) => {
  res.render("home");
});

// STOCKS SECTION
app.get("/sections", (req, res) => {
  res.render("stocks/sections");
});

// this route is where i've listed only all iphone models
app.get("/products/:type", (req, res) => {
  const { type } = req.params;
  res.render("stocks/products", { type });
});

// this route list all products of a specific type (eg: ipad, macbook, series...etc.)
// this route also accepts a query string (?categ=7/8/SE) when searching for phones
// thus url/devices/phones?categ=SE (lists all iphone SE models)
app.get("/devices/:type", async (req, res) => {
  const { type } = req.params;
  let virtualSelectedProduct = [];
  // 1. get all Data of data[type], where type could be [iphone, ipad, macbook, series, homepod,...etc.]
  try {
    virtualSelectedProduct = await anyObj(
      { model: type },
      virtualSelectedProduct,
      "view"
    );
    if (!virtualSelectedProduct) throw Error(`Couldn't find data Device`);
    // 2. After getting relevant Data, return only the version of the products
    // the versions could be [s, s-plus, xs-max, pro, pro, s-plus, pro-max, etc.]
    // ...and hence remove duplicates from the versions list
    const getDocVersions = virtualSelectedProduct.map((dev) => dev.version);
    let eachDocVersion = new Set(getDocVersions);
    eachDocVersion = [...eachDocVersion];

    // check if endpoint request
    if (req.query?.type) {
      res.send({ eachDocVersion, type });
      return;
    }

    // 3. send both version [s, s-plus, xs-max, pro, pro-max, etc.] and type [ipad, macbook, series, ipod,...etc.] to render page
    res.render("stocks/devices", { eachDocVersion, type });
  } catch (err) {
    console.log(err.message);
    res.send("Error fetching request");
  }
});

app.get("/product/:sku", async (req, res) => {
  const { sku } = req.params;
  const { model } = req.query;

  let virtualSelectedProduct = [];
  const query = { model: sku, version: model };

  // 1. We get sku & model from url. sku = [se, 5, 8, 14, series, ipad, macbook, ...etc.]
  // ...model = ['', pro-max, plus, s-plus, air, mini,...etc.]

  // 2. Search database using the following filter document.model = sku && document.version = model
  try {
    virtualSelectedProduct = await anyObj(
      query,
      virtualSelectedProduct,
      "view"
    );
    if (!virtualSelectedProduct) throw Error(`Couldn't find data`);

    // create endpoint
    if (req.query?.endpoint) {
      res.send(virtualSelectedProduct);
    }
    // 3. render page
    res.render("stocks/checkout", { virtualSelectedProduct });
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/insert/:target", async (req, res) => {
  const { target } = req.params;
  const validData = req.body;
  const getSize = new Map(Object.entries(validData));
  const err = [];
  getSize.forEach((v, k) => {
    if (k === "version" || k === "bh" || k === "color") return;
    v.length === 0 && err.push(k);
  });
  // push to database using target
  if (getSize.size === 0 || err.length > 0) {
    res.send("Empty Data");
    return;
  }
  let theDate = new Date().toISOString();
  if (target === "accessories") {
    validData.temp_quantity = validData.quantity;
    let { product_type, quantity: newQty } = validData;
    const query = { product_type: product_type };
    const prodRes = await Accessories.find(query);
    if (prodRes.length === 0) {
      // no product type found
      Accessories(validData).save();
    } else {
      // product type found
      const { quantity } = prodRes[0];
      newQty = +newQty + quantity;
      await Accessories.findOneAndUpdate(query, {
        quantity: newQty,
        temp_quantity: newQty,
      });
    }
    res.send("added");
    return;
  }
  [validData.date_added, validData.time_added] = theDate.split("T");
  switch (target) {
    case "phones":
      schVal = Phones(validData).save();
      break;
    case "macbook":
      schVal = Macbooks(validData).save();
      break;
    case "ipad":
      schVal = Ipads(validData).save();
      break;
    case "series":
      schVal = Series(validData).save();
      break;
    case "airpod":
      schVal = AirPods(validData).save();
      break;
    default:
      schVal = [];
      break;
  }
  schVal.then(() => {
    res.send("added");
  });
});

app.get("/data/:id", async (req, res) => {
  const { id } = req.params;
  let virtualSelectedProduct = [];
  const query = { _id: new ObjectId(id) };
  try {
    virtualSelectedProduct = await anyObj(
      query,
      virtualSelectedProduct,
      "view"
    );
    if (!virtualSelectedProduct) throw Error(`Couldn't find data`);
    const [singleProduct] = virtualSelectedProduct;
    res.send(singleProduct);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/sections/:type", async (req, res) => {
  const { type } = req.params;
  let schVal = [];
  const action = type;
  switch (action) {
    case "phones":
      schVal = Object.keys(Phones.schema.obj);
      break;
    case "macbook":
      schVal = Object.keys(Macbooks.schema.obj);
      break;
    case "ipad":
      schVal = Object.keys(Ipads.schema.obj);
      break;
    case "series":
      schVal = Object.keys(Series.schema.obj);
      break;
    case "airpod":
      schVal = Object.keys(AirPods.schema.obj);
      break;
    case "accessories":
      schVal = Object.keys(Accessories.schema.obj);
      break;
    default:
      schVal = [];
      break;
  }
  res.send(schVal);
});
app.patch("/edit", async (req, res) => {
  const updatedData = req.body;
  const { id } = req.body;
  const ething = [Phones, Macbooks, Ipads, Series, AirPods];
  ething
    .reduce(async (previous, value) => {
      await previous;
      const val = await value.findOneAndUpdate({ _id: id }, updatedData, {
        new: true,
      });
      return new Promise((res) => {
        let x = "";
        if (val) x = val;
        res(x);
      });
    }, Promise.resolve())
    .then(() => {
      res.send("edited");
    });
});

app.post("/sell", async (req, res) => {
  let { cname, cphone, cdate, ctime, payment, cnote, cident, methodRatio } =
    req.body;
  const idPrice = cident.split("-");
  let [id, price] = idPrice;
  price = +price;

  let virtualSelectedProduct = [];
  const query = { _id: new ObjectId(id) };
  try {
    virtualSelectedProduct = await anyObj(
      query,
      virtualSelectedProduct,
      "view"
    );
    if (!virtualSelectedProduct) throw Error(`Couldn't find data`);
    const [singleProduct] = virtualSelectedProduct;
    const checkOutData = {
      customer_name: cname.toLowerCase(),
      customer_phone: cphone,
      payment_method: payment,
      note: cnote.toLowerCase(),
      amount: price,
      quantity: 1,
      total_paid: price,
      check_time: ctime,
      check_date: cdate,
      method_ratio: methodRatio,
    };
    const originalDataPlusOut = Object.assign({}, singleProduct, checkOutData);
    const checkOutDevice = CheckedOut(originalDataPlusOut);
    checkOutDevice.save().then(async function () {
      // now delete product from database
      try {
        let soldRes = await anyObj(query, [], "remove");
        if (!soldRes) throw Error(`Couldn't Sell data`);
        const [finRes] = soldRes;
        // finRes = 'sold'
        res.send(finRes);
      } catch (err) {
        console.log(err.message);
      }
    });
  } catch (err) {
    console.log(err.message);
  }
});
// STOCKS SECTION

// SALES SECTION
app.get("/sales", (req, res) => {
  res.render("sales/dashboard");
});

app.get("/accounts", (req, res) => {
  res.render("sales/accounts");
});

app.post("/checkout", async (req, res) => {
  const accessData = req.body;
  const allAccessories = [];
  const prdErr = [];
  const everyItem = [];
  const tempChanged = [];

  // 1.Loop through all the products we want to checkout
  const doWhat = Object.keys(accessData).reduce(async (previous, model) => {
    await previous;
    let [quant] = accessData[model];

    const whatPrd = model.toLowerCase();
    // 'whatPrd' is the current item in the loop
    let combo = [];

    // check if the item is a Full Set item
    // thus: two different items combined makes up this item
    // eg: Type C full set (2 pins) = Type C cord + Type C head (2 pins)
    switch (whatPrd) {
      case "type c set (2-pins)":
        combo = ["type c cord-only", "type c head (2-pins)"];
        break;
      case "type c set (3-pins)":
        combo = ["type c cord-only", "type c head (3-pins)"];
        break;
      case "usb set (2-pins)":
        combo = ["usb cord-only", "usb head (2-pins)"];
        break;
      case "usb set (3-pins)":
        combo = ["usb cord-only", "usb head (3-pins)"];
        break;
      default:
        break;
    }
    const initErr = [];
    const mapLessErr = new Map();
    const checkAvailPrd = async (checkRes, prdType) => {
      if (checkRes.length === 0) {
        // this means one or both of the individual items is/are not in stock

        // so take note of this item
        initErr.push(prdType);
      } else {
        const foundItemQty = checkRes[0].temp_quantity; //this is the quantity of individual item we have in stock
        const belowValue = foundItemQty - +quant; //we're subtracting the quantity the client is buying from the quantity we have in stock
        if (belowValue < 0) {
          //ordering qty is more than stock qty
          mapLessErr.set(prdType, belowValue / -1); //insert the quantity needed to complete the checkout in an array

          // so take note of this item
          initErr.push(mapLessErr);
          foundItemQty === 0 && initErr.push(prdType);

          // set the temp_quantity of this item to '0',
          /* so that if another loop contains this same item, we let the loop
                            knows a previous item was made up of more than the quantity 
                            we have in stock for this item
                        */
          /* This will also help us to know the total quantity of this item we need in stock
                            to complete the whole purchase in the cart
                        */
          await Accessories.findOneAndUpdate(
            { product_type: prdType },
            { temp_quantity: 0 }
          );

          // after changing the temp_quantity to '0', we need to
          // take note of this item (by inserting it in an array)
          // so that we can reset the temp_quantity back to the
          // original quantity of this item after an unsuccessful checkout
          tempChanged.push(prdType);
        } else {
          //subtract ordering qty from stock qty in db
          // this implies, we have enough of this item in stock
          // so take note of this item
          everyItem.push(prdType);

          // and hence, set the temp_quantity of this item to (stock qty - ordered qty)
          await Accessories.findOneAndUpdate(
            { product_type: prdType },
            { temp_quantity: belowValue }
          );
        }
      }
      // console.log(initErr);
      return initErr;
    };

    if (combo.length === 2) {
      // this means item is a full set
      // product is a set
      const theErr = combo.reduce(async (prev, section) => {
        await prev;

        /* Check in Accessories database to see if we have 
                    the individual items that make up this full set item*/

        // Eg: If we're checking out Type C full set (2 pins)
        // We need to check if we have 'Type C cord' and 'Type C head (2 pins)' in stock
        const itemRes = await Accessories.find({ product_type: section });

        // 'section' is the individual item
        // 'itemRes' is the results of whether the item is in stock or not
        let returnErr = await checkAvailPrd(itemRes, section);

        //the results of this is an array containing items
        // (a) we don't have in stock
        // (b) is not enough in stock
        return new Promise((res) => res(returnErr));
      }, Promise.resolve());
      const indErr = await theErr; // if the result of this is an empty array, it means we have enough of this item in stock

      // else we don't have enough of this item in stock so take note of this item
      indErr.length > 0 && prdErr.push(indErr);
    } else {
      // single product
      // We are checking out just a single product

      // check to see if this item is in stock
      const itemRes = await Accessories.find({ product_type: whatPrd });

      // 'whatPrd' is the item
      // 'itemRes' is the results of whether the item is in stock or not
      const returnErr = await checkAvailPrd(itemRes, whatPrd); // if the result of this is an empty array, it means we have enough of this item in stock

      // else we don't have enough of this item in stock so take note of this item
      returnErr.length > 0 && prdErr.push(returnErr);
    }

    // Wait till we have looped through all Full Set and Single items
    // and return results of every Array.
    // The Arrays stores items that are
    // (a) 'prdErr' : Items that are out of Stock or not enough in stock
    // (b) 'everyItem' : Items that are enough in stock
    // (c) 'tempChanged' : Items that their temp_quantity must be changed from '0' to their 'original quantity'
    // because their quantity was not enough to checkout the quantity we needed
    return new Promise((res) => res([prdErr, everyItem, tempChanged]));
  }, Promise.resolve());
  let prdFinRes = await doWhat; // this is an array containing an array of results from 'prdErr', 'everyItem' and 'tempChanged'

  // We destructured result and assigned each to a new variables
  const [outStock, prdSold, justTemp] = prdFinRes;

  // Remove duplicate items from the products we have in stock
  // Eg: if we were able to checkout both a Type C Full Set (2 pins) and Type C Head (2 pins)
  // We'd have an array like ['type c cord', 'type c head (2 pins)', 'type c head (2 pins)']
  // so we just remove any duplicate items from the array
  let uniqPrdSold = [...new Set(prdSold)];

  //
  let changeAllTemp = [...justTemp, ...uniqPrdSold];
  changeAllTemp = [...new Set(changeAllTemp)];

  if (outStock.length === 0) {
    // all products qty was available
    //set products original qty to temp_qty
    let updateCount = 0;
    const doneOperation = uniqPrdSold.reduce(async (prv, prdType) => {
      await prv;
      const eachPrdData = await Accessories.find({ product_type: prdType });
      const { temp_quantity } = eachPrdData[0];
      // update original qty to temp_qty
      const updateRes = await Accessories.findOneAndUpdate(
        { product_type: prdType },
        { quantity: temp_quantity },
        { new: true }
      );
      updateRes && updateCount++;
      return new Promise((res) => res(updateCount));
    }, Promise.resolve());
    const finOperation = await doneOperation;
    if (finOperation === uniqPrdSold.length) {
      // finished updating sold products in db
      // save data in checkout db
      Object.keys(accessData).forEach((model) => {
        let [
          quant,
          price,
          note,
          payment_method,
          customer_details,
          date,
          ...payRate
        ] = accessData[model];
        let method_ratio = {};
        payRate.forEach((rate) => {
          for (let [k, v] of Object.entries(rate)) {
            method_ratio[k] = v;
          }
        });
        customer_details = customer_details.toLowerCase();
        note = note.toLowerCase();
        const [check_date, check_time] = date.split("T");
        const amount = +price;
        const quantity = +quant;
        const total_paid = +quantity * amount;
        const productData = {
          model,
          quantity,
          amount,
          note,
          payment_method,
          method_ratio,
          customer_details,
          total_paid,
          check_time,
          check_date,
        };
        allAccessories.push(productData);
      });
      CheckedOut.insertMany(allAccessories)
        .then(() => {
          console.log("Sold Successfully");
          res.send("sold");
        })
        .catch((err) => {
          // res.send('unable')
        });
    } else {
      //couldn't update all sold products
      // highly unlikely this section will execute
    }
  } else {
    // some products are out of stock
    // set temp_qty to original qty

    // console.log(outStock);
    const outStockAndDuplics = [...new Set(outStock)];
    const justSingleOutStocks = [];
    outStockAndDuplics.forEach((outStock) => {
      const singleSet = new Set(outStock);
      justSingleOutStocks.push([...singleSet]);
    });
    console.log(justSingleOutStocks);
    const holdAllPrdErr = justSingleOutStocks.flat(2);
    // console.log(holdAllPrdErr);
    const insufErr = [];
    let outStockErr = [];
    holdAllPrdErr.forEach((el) => {
      typeof el === "object" ? insufErr.push(el) : outStockErr.push(el);
    });
    // console.log(insufErr);
    // console.log(outStockErr);

    // loop through insufficient items and sum their quantity needed
    const insuffQty = {};
    insufErr.forEach((mapRes) => {
      mapRes.forEach((v, k) => {
        insuffQty[k] = insuffQty[k] ? (insuffQty[k] += v) : v;
      });
    });
    // console.log(insuffQty);

    // remove duplicates from out of stock items array
    outStockErr = new Set(outStockErr);
    const finalOutStockPrds = [...outStockErr];
    console.log(finalOutStockPrds);

    finalOutStockPrds.forEach((item) => {
      if (insuffQty[item]) return;
      insuffQty[item] = 0;
    });
    console.log(insuffQty);
    console.log(changeAllTemp.length);

    if (changeAllTemp.length > 0) {
      let updateCount = 0;
      const resetTempQty = changeAllTemp.reduce(async (prv, prdType) => {
        await prv;
        const eachPrdData = await Accessories.find({ product_type: prdType });
        const { quantity } = eachPrdData[0];
        // update temp_qty to original qty
        const resetTemp = await Accessories.findOneAndUpdate(
          { product_type: prdType },
          { temp_quantity: quantity },
          { new: true }
        );
        resetTemp && updateCount++;
        return new Promise((res) => res(updateCount));
      }, Promise.resolve());
      const finOperation = await resetTempQty;
      if (finOperation === changeAllTemp.length) {
        // updated temp_quantity successfully
        console.log(`Couldn't sell accessories`);
        res.send(insuffQty);
      }
    } else {
      // all products we checked-out has not ever been added to stock
      console.log(`Couldn't sell accessories`);
      res.send(insuffQty);
    }
  }
});

app.get("/sold/:date", async (req, res) => {
  const { date } = req.params;
  const dateData = await CheckedOut.find({ check_date: date });
  const docLen = await CheckedOut.countDocuments({ check_date: date });
  try {
    if (!docLen) throw new Error("Couldn't count Checkout items");
    if (docLen) {
      if (req.query?.act) {
        let amountData = await dateData;
        amountData = amountData.map((eachDoc) => eachDoc.total_paid);

        const totalAmount = amountData.reduce((a, b) => a + b, 0);
        res.send({ totalAmount });
      } else {
        let allPrdSold = await dateData
        allPrdSold = allPrdSold.map((eachDoc) => eachDoc.model);
        console.log(allPrdSold);

        const uniqModels = new Set(allPrdSold);
        const soldPrds = [...uniqModels];
        const mapPrds = [];
        const holPrds = await soldPrds.reduce(async (prv, val) => {
          await prv;
          const prdDocs = await CheckedOut.find({
            model: val,
            check_date: date,
          });
          mapPrds.push(prdDocs);
          return new Promise((res) => {
            res(mapPrds);
          });
        }, Promise.resolve());
        const mapRes = new Map();
        holPrds.forEach((arr, k) => {
          mapRes.set(soldPrds[k], arr);
        });
        const allObj = {};
        mapRes.forEach((v, k) => {
          v.forEach((e) => {
            let type = k;
            console.log(type);
            if (type.length <= 2) {
              type = "phones";
            }
            if (!allObj[type]) {
              allObj[type] = [];
            }
            allObj[type].push(e);
          });
        });

        const mapedData = new Map(Object.entries(allObj));
        const fullPrdDetails = new Map();
        let cash = 0;
        let momo = 0;
        mapedData.forEach((v, k) => {
          let initQty = 0;
          let mapTotal = 0;
          v.forEach((e) => {
            mapTotal += e.total_paid;
            initQty += e.quantity;
            (e.payment_method === "cash" && (cash += +e.method_ratio.cash)) ||
              (e.payment_method === "momo" && (momo += +e.method_ratio.momo)) ||
              (e.payment_method === "split" &&
                ((momo += +e.method_ratio.momo) || 1) &&
                (cash += +e.method_ratio.cash));
          });
          fullPrdDetails.set(k, { quantity: initQty, totalAmt: mapTotal });
        });
        const soldObj = { cash, momo };
        fullPrdDetails.forEach((v, k) => (soldObj[k] = v));
        res.send(soldObj);
      }
    } else {
      res.send({ data: "none" });
    }
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/search", (req, res) => {
  res.render("sales/search");
});

app.get("/fetch/:searchItem", async (req, res) => {
  const { query: queryString } = req.query;
  const { searchItem } = req.params;
  let query = {};
  switch (searchItem) {
    case "imei":
      // query = {imei: {$regex: `/${queryString}/`}};
      query = { imei: queryString };
      break;
    case "serial":
      query = { serial: queryString };
      break;
    case "customer":
      query = {
        $or: [
          { customer_name: queryString },
          { customer_phone: queryString },
          { customer_details: queryString },
        ],
      };
      break;
    case "date":
      query = {
        $or: [{ date_added: queryString }, { check_date: queryString }],
      };
      break;
    default:
      break;
  }
  try {
    let virtualSelectedProduct = [];
    virtualSelectedProduct = await anyObj(
      query,
      virtualSelectedProduct,
      "search"
    );
    res.send(virtualSelectedProduct);
  } catch (err) {
    console.log(err.message);
  }
  // res.send(query);
});

// SALES SECTION

app.get("*", (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
