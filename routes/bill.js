const express = require('express');
const connection = require('../connection'); 
const router = express.Router(); 
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var uuid = require('uuid');
var auth = require('../services/authentication');
const fs = require('fs');



router.post('/generateReport', auth.authenticateToken, (req, res, next) => {
    const generatedUuid = uuid.v1(); 
    const orderDetails = req.body;

    // Verificar que productDetails es un JSON válido
    let productDetailsReport;
    try {
        productDetailsReport = typeof orderDetails.productDetails === "string" 
            ? JSON.parse(orderDetails.productDetails) 
            : orderDetails.productDetails;
    } catch (error) {
        return res.status(400).json({ error: "Invalid productDetails JSON" });
    }

    // Convertir productDetails a string para insertarlo en la base de datos
    const productDetailsString = JSON.stringify(productDetailsReport);

    const query = "INSERT INTO bill (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) VALUES (?,?,?,?,?,?,?,?)"; 
    connection.query(query, [
        orderDetails.name, 
        generatedUuid,
        orderDetails.email, 
        orderDetails.contactNumber, 
        orderDetails.paymentMethod, 
        orderDetails.totalAmount, 
        productDetailsString, 
        res.locals.email
    ], (err) => {     // Eliminamos `results` si no se usa
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error", details: err });
        } else {
            // Renderizar la vista ejs
            ejs.renderFile(path.join(__dirname, '', "report.ejs"), {
                productDetails: productDetailsReport,
                name: orderDetails.name,
                email: orderDetails.email,
                contactNumber: orderDetails.contactNumber,
                paymentMethod: orderDetails.paymentMethod,
                totalAmount: orderDetails.totalAmount
            }, (err, html) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Error rendering PDF", details: err });
                } else {
                    // Crear el archivo PDF
                    pdf.create(html).toFile('./generated_pdf/' + generatedUuid + ".pdf", function (err, data) {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ error: "Error generating PDF", details: err });
                        } else {
                            // Responder con el UUID generado
                            return res.status(200).json({ uuid: generatedUuid });
                        }
                    });
                }
            });
        }
    });
});

router.post('/getPdf', auth.authenticateToken,function(req,res){
    const orderDetails = req.body;
    const pdfPath = './generated_pdf/'+orderDetails.uuid+'.pdf';
    if (fs.existsSync(pdfPath)) {
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    } else{
        var productDetailsReport = JSON.parse(orderDetails.productDetails);
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error", details: err });
        } else {
            // Renderizar la vista ejs
            ejs.renderFile(path.join(__dirname, '', "report.ejs"), {
                productDetails: productDetailsReport,
                name: orderDetails.name,
                email: orderDetails.email,
                contactNumber: orderDetails.contactNumber,
                paymentMethod: orderDetails.paymentMethod,
                totalAmount: orderDetails.totalAmount
            }, (err, html) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Error rendering PDF", details: err });
                } else {
                    // Crear el archivo PDF
                    pdf.create(html).toFile('./generated_pdf/' + orderDetails.uuid + ".pdf", function (err, data) {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ error: "Error generating PDF", details: err });
                        } else {
                            // Responder con el UUID generado
                            return res.status(200).json({ uuid: generatedUuid });
                        }
                    });
                }
            });
        }
    }
})

router.get('/getBills', auth.authenticateToken, (req, res, next) => {
    var query = "SELECT * FROM bill order by id DESC";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:id', auth.authenticateToken,(req, res)=> {
    const id = req.params.id;
    const query = "DELETE FROM bill WHERE id =?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if(results.affectedRows == 0){
                return res.status(404).json({ message: "La factura no se encontró" });
            }
            return res.status(200).json({ message: "Factura eliminada exitosamente" });
        } else {
            return res.status(500).json(err);
        }
    });
})

module.exports = router;