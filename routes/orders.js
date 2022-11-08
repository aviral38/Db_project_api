const express = require('express')
const router = express.Router()
const { getfewerOrders, getUserExpend } = require("../controllers/orders")

router.route('/fewerOrders').get(getfewerOrders)
router.route('/userExpend').get(getUserExpend)
module.exports = router