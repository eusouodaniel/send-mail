const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const server = express();
server.use(bodyParser.json());
server.use(cors());

server.post('/send-mail', async function (req, res) {
    const transporter = createConnect();

    const mailOptions = createMailOptions(req.body)

    try {
        await transporter.sendMail(mailOptions);

        return res.json({'status': 200});
    } catch (e) {
        return res.json({'status': 500});
    }


});

function createConnect() {
    return nodemailer.createTransport({
        service: process.env.MAIL_SERVICE, 
        auth: { 
           user: process.env.MAIL_AUTH_USER, 
           pass: process.env.MAIL_AUTH_PASS
         }
    });
}

function createMailOptions(data) {
    const name = data.name ? data.name : 'Without name';
    const email = data.email ? data.email : 'Without email';
    const message = data.message ? data.message : 'Without message';

    return {
        from: process.env.MAIL_AUTH_USER,
        to: process.env.MAIL_RECEIVE,
        subject: process.env.MAIL_SUBJECT+" - "+name,
        html: message+" "+"<br><br> <b>Meu email:</b> "+email
    }
}

server.listen(process.env.PORT || 3000);
