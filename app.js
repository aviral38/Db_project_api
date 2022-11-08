const express = require('express')
const app = express()
const resturant = require('./routes/resturant.js')
const orders = require('./routes/orders.js')
const bodyParser = require('body-parser')





app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json())

app.use('/resturants', resturant)
app.use('/orders', orders)
app.get('/', (req, res) => {
    res.send("welcome")
})
//var port = 8000
app.listen(process.env.PORT || 8000, () => {
    console.log("hosted")
})
