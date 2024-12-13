const express = require('express');
const connection = require('../connection'); 
const router = express.Router(); 
var auth = require('../services/authentication'); 
var checkRole = require('../services/checkRole');

router.post('/add',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let category = req.body; 
    query="insert into category (name) values(?)"; 
    connection.query(query,[category.name],(err,results)=>{
        if(!err){
            return res.status(200).json({message:"Categoria agregada satisfactoriamente"});
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get',auth.authenticateToken,(req, res, next)=> {
    var query = "SELECT * FROM category order by name";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body; 
    if (!product || !product.name || !product.id) {
        return res.status(400).json({ message: "Datos faltantes: 'name' y 'id' son requeridos" });
    }

    var query = "UPDATE category SET name=? WHERE id=?";
    connection.query(query, [product.name, product.id], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Categoría actualizada" });
        } else {
            return res.status(500).json(err);
        }
    });
});

module.exports = router;