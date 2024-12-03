require ( 'dotenv'). config();
const http = require('http');
const app = require('./index');

const server = http.createServer (app);
server. listen(process.env.PORT, ()=> {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});