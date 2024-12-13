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

router.get('/getByCategory/:id', auth.authenticateToken, (req,res,next)=>{
    const id = req.params.id;
    var query = "SELECT id, name FROM product categoryId WHERE categoryId=? and status='true' ";
    connection.query(query,[id], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
});

router.get('/getById/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "SELECT id, name, description, price FROM product WHERE id=?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.length > 0) {
                return res.status(200).json(results[0]); // Devuelve el primer producto
            } else {
                return res.status(404).json({ message: "Producto no encontrado" }); // Si no se encuentra el producto
            }
        } else {
            return res.status(500).json(err); // Error en la consulta
        }
    });
});


router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let product = req.body;
    
    // Validar que todos los campos necesarios estén presentes
    if (!product.name || !product.categoryId || !product.description || !product.price || !product.id) {
        return res.status(400).json({ message: "Faltan campos necesarios en la solicitud" });
    }
    
    // Consulta SQL corregida
    var query = "UPDATE product SET name=?, categoryId=?, description=?, price=? WHERE id=?";
    
    // Ejecutar la consulta con los parámetros correctos
    connection.query(query, [product.name, product.categoryId, product.description, product.price, product.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "El producto no se encontró" });  // Producto no encontrado
            }
            return res.status(200).json({ message: "Producto actualizado" });  // Producto actualizado exitosamente
        } else {
            return res.status(500).json(err);  // Error en la consulta
        }
    });
});


router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    const id = req.params.id;
    const query = "DELETE FROM product WHERE id = ?";
    
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al eliminar el producto", error: err });
        }
        
        if (results.affectedRows == 0) {
            return res.status(404).json({ message: "El producto no se encontró" });
        }

        return res.status(200).json({ message: "Producto eliminado exitosamente" });
    });
});

module.exports = router;