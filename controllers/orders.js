const express = require('express');
var sql = require('mysql');
require('dotenv').config()
console.log(process.env.host)
const con = sql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

con.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});


const getUserExpend = (req, res) => {
    query = "(Select Total,u.FirstName,u.LastName from orders Natural Join user u Where Total =(Select Max(Total) from orders) And u.LastName Like " + '"A%"' + ") union (Select Total,u.FirstName,u.LastName from orders Natural Join user u where Total =(Select Min(Total) From orders) and u.LastName Like 'A%') order by Total Desc"
    try {
        con.query(query, (err, result) => {
            if (err) {
                //console.log(err)
                res.send(err.sqlMessage)
                // throw "Exception"

            }
            else {
                var orders = []
                result.forEach(order => {
                    orders.push({
                        "total": order.Total,
                        "firstName": order.FirstName,
                        "lastName": order.LastNameß
                        // "resturant": order.VendorName
                    })
                });

            }
            res.send(orders)
        });
    } catch (error) {

        res.send(error)
    }

}




const getfewerOrders = (req, res) => {
    query = "Select Count(*) as freq, Item From orders Natural JOIN vendor group by Item Having freq <= (SELECT AVG(temp.num_count) from (Select count(*) as num_count from orders group by Item) as temp) order by Item"

    try {
        con.query(query, (err, result) => {
            if (err) {
                //console.log(err)
                res.send(err.sqlMessage)
                // throw "Exception"

            }
            else {
                var orders = []
                result.forEach(order => {
                    orders.push({
                        "freq": order.freq,
                        "item": order.Item,
                        // "resturant": order.VendorName
                    })
                });

            }
            res.send(orders)
        });
    } catch (error) {

        res.send(error)
    }

}

module.exports = { getfewerOrders, getUserExpend }
