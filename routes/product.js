const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let product = req.body; 
    var query="insert into product (name, categoryId, description, price, status) values(?,?,?,?,'true')"; 
    connection.query(query,[product.name, product.categoryId, product.description, product.price, product.status],(err,results)=>{
        if(!err){
            return res.status(200).json({message:"Producto agregado satisfactoriamente"});
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get', auth.authenticateToken, (req,res,next)=>{
    var query = "SELECT p.id, p.name, p.description, p.price, p.status, c.id AS categoryId, c.name AS categoryName FROM product AS p INNER JOIN category AS c ON p.categoryId = c.id;";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})
module.exports = router;