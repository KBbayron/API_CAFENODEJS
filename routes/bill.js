const express = require('express');
const connection = require('../connection'); 
const router = express.Router(); 
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var uuid = require('uuid');
var auth = require('../services/authentication');

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

module.exports = router;
