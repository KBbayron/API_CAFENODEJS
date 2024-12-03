const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/singup',(req, res) => {
    let user = req.body;
    query = "select email, password, status, role from user where email=?"
    connection.query(query,[user.email],(err, results)=>{
        if (!err){
            if (results.length <= 0){
                query = "insert into user (`name`, contactNumber, email, `password`, `status`, `role`) values (?,?,?,?,'false', 'user')"
                connection.query(query,[user.name, user.email, user.contactNumber, user.password], (err, result) => {
                    if (!err){
                        return res.status(200).json({message: 'Usuario registrado correctamente'})
                    } else {
                        return res.status(500).json(err);
                    }
                })
            } else {
                return res.status(409).json({message: 'El email ya está registrado'})
                }
        } else {
            return res.status(500).json(err)
        }
    })
})

router.post('/login', (req,res) => {
    const user = req.body;
    query = "select email, password, status, role from user where email=?"
    connection.query(query,[user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password !== user.password) {
                return res.status(401).json({message: 'Email o contraseña incorrectos'});
            } else if (results[0].status === 'false') {
                return res.status(401).json({message: 'Espera por admision de administrador'});
            } else if (results[0].password == user.password) {
                const response = {email: results[0].email, role: results[0].role};
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {expiresIn: '8h'});
                res.status(200).json({token: accessToken});
            } else {
                return res.status(400).json({message: 'Error de ingreso. Intenta denuevo.'});
            };
        } else {
            return res.status(500).json(err)
        }
    })
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})

Router.post('/forgot/password', (req, res)=>{
    const user = req.body;
    query = "select email, password from user where email=?";
    connection.query(query, [user.email, (err,results)=>{
        if (!err){
            if (results.length<=0){
                return res.status(200).json({message: "La constrasena se envio con exito"});
            } else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Recuperacion de contraseña',
                    html: <p>
                        Tu contrasena es 
                    </p>
                };
            }
        } else {
            return res.status(500).json(err);
        }
    }])
})

module.exports = router;