const express = require('express');
var sql = require('mysql');
require('dotenv').config()
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


const getResturants = async (req, res) => {

    const query = "Select * from vendor"
    run_query(con, query, (result) => {

        res.status(200).json(result)
    })


}


const addResturant = (req, res) => {
    var body = req.body

    var b = 00
    var query = "Insert into vendor(VendorId,PhoneNumber,Address,FirstName,LastName,VendorName,Type) values (" + body.VendorId + "," + body.PhoneNumber + "," + '"' + body.Address + '"' + "," + '"' + body.FirstName + '"' + "," + '"' + body.LastName + '"' + "," + '"' + body.VendorName + '"' + "," + '"' + body.Type + '"' + ")"
    try {
        con.query(query, (err, result) => {
            if (err) {
                console.log("lkdnlnln")
                //console.log(err)
                res.send(err.sqlMessage)
                // throw "Exception"

            }
            else {
                console.log(result)
                res.json({ "report": "data inserted successfully" })

            }


        });
    } catch (error) {

        res.send(error)
    }

    console.log(query)

}

const updateResturant = (req, res) => {
    var body = req.body
    var attribute = body.attribute
    var value = body.value
    var id = body.id
    var query = "update vendor set " + attribute + "= " + '"' + value + '"' + " where VendorId=" + id
    // res.send(query)
    con.query(query, (err, result) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        else {
            res.send(result)
            console.log(result)
        }
    });
}

const deleteResturant = (req, res) => {
    var body = req.body
    var query = "delete from vendor where VendorId=" + body.id
    con.query(query, (err, result) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        else {
            res.send(result)
            console.log(result)
        }
    });
}

const getDetails = (req, res) => {
    var id = req.query.id
    var query = "Select PhoneNumber,Address,FirstName,LastName,VendorName,Type from vendor where VendorId=" + id
    console.log(query)
    con.query(query, (err, result) => {
        if (result.length == 0) {
            res.send("The Id in not present in database")
        }

        else {
            var response = {
                "VendorId": id,
                "PhoneNumber": result[0].PhoneNumber,
                "Address": result[0].Address,
                "FirstName": result[0].FirstName,
                "LastName": result[0].LastName,
                "VendorName": result[0].VendorName,
                "Type": result[0].Type

            }
            res.send(response);

        }
    })
}

const getVendorDetails = (req, res) => {
    var vendor = req.body.vendor
    query = "Select * from vendor where VendorName like " + "'%" + vendor + "%'"
    con.query(query, (err, result) => {
        if (err) {
            res.send(err)
        }

        else {
            var vendors = []
            i = 0

            result.forEach((ven) => {
                q = "Select Round(avg(o.Ratings),2) as rating from vendor v join orders o on (v.VendorId=o.VendorId) where v.VendorId=" + ven.VendorId + " group by v.VendorId"
                console.log(ven)
                subquery(con, q, (rating) => {
                    vendors.push({
                        "name": ven.VendorName,
                        "phoneNumber": ven.PhoneNumber,
                        "address": ven.Address,
                        "type": ven.Type,
                        "rating": rating
                    })
                    console.log(rating)
                    console.log(vendors)
                    i++
                    if (i == result.length) {
                        res.send(vendors)
                    }
                })





            })


        }
    })



}

async function run_query(con, query, callback) {
    console.log("qeoinfroi   1")
    var vendorData = []
    con.query(query, (err, result) => {
        if (err) {
            console.log(1);
            console.log(err);
            reject(err)
        }
        console.log("qeoinfroi")
        var i = 0
        var k = 0
        result.forEach((vendor) => {
            k = k + 1
            console.log(vendor)
            q = "Select Round(avg(o.Ratings),2) as rating from vendor v join orders o on (v.VendorId=o.VendorId) where v.VendorId=" + vendor.VendorId + " group by v.VendorId"
            subquery(con, q, (rating) => {
                vendorData.push({
                    "name": vendor.VendorName,
                    "phoneNumber": vendor.PhoneNumber,
                    "address": vendor.Address,
                    "type": vendor.Type,
                    "rating": rating

                })
                //console.log(rating)
                i = i + 1
                if (i == result.length) {

                    callback(vendorData)
                }
            })


            // console.log(`${row.name} lives in ${row.city}`);
            // vendorData.push({
            //     "name": vendor.VendorName,
            //     "phoneNumber": vendor.PhoneNumber,
            //     "address": vendor.Address,
            //     "type": vendor.FoodType,
            //     "rating": rating

            // })

        });
        // if (i == 1000) {
        //     console.log("lknf")
        // }
        // callback(vendorData)
    });


}

function subquery(con, q, callback) {

    con.query(q, (err, re) => {
        if (err) {
            console.log(2)
            console.log(err)
        }

        if (re.length == 1) {

            callback(re[0].rating)

        }
        else {
            callback('N/A')
        }


    });


}
module.exports = { getResturants, addResturant, updateResturant, deleteResturant, getDetails, getVendorDetails }