const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');


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

router.post('/forgotPassword', (req, res)=>{
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
                    html: '<p><b>Sus datos de acceso para la gestión de la cafetería</b><br><b>Email:</b>'+results[0].email+ '<br><b>Password: </b>'+results[0].password+'<br> <a herf= "http://localhost:4200/user/loging"></a>Haz click aqui para recuperar</p>'
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        return res.status(500).json({message: 'Error al enviar el correo'});
                    } else {
                        console.log('Email sent:'+ info.response);
                        return res.status(200).json({message: 'La constrasena se envio con exito'});
                    }
                });
            }
        } else {
            return res.status(500).json(err);
        }
    }])
})

router.get('/get',auth.authenticateToken, checkRole.checkRole,(req,res) => {
    var query = "SELECT id, name, email, contactNumber, satus from user where role='user'";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/update', auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let user = req.body;
    var query = "UPDATE user SET status=? WHERE id=?";
    connection.query(query,[user.status, user.id],(err, results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"El usuario no se encontró"});
            }
            return res.status(200).json({message: "Usuario actualizado"});
        } else {
            return res.status(500).json(err); 
        }
    })
})

router.get('/checkToken', auth.authenticateToken, (req, res) => {
    return res.status(200).json({ message: "true" });  
});

router.post('/changePassword',auth.authenticateToken,(req, res) =>{
    const user = req.body;
    const email = res.locals.email;
    query = "SELECT * FROM user where email=? and password=?";
    connection.query(query,[email, user.oldPassword], (err, results) => {
        if (!err) {
            if (results.length <= 0){
                return res.status(400).json({message: 'Contraseña incorrecta'});
            } else if (results[0].password === user.oldPassword){
                query = "update user set password=? where email=?"
                connection.query(query,[user.newPassword, email], (err, result) => {
                    if (!err){
                        return res.status(200).json({message: 'Contraseña actualizada correctamente'});
                    } else {
                        return res.status(500).json(err);
                    }
                });
            } else {
                return res.status(400).json({message: 'Algo salio mal. Intenta de nuevo'});
            }
        }else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;