const express = require('express');
const parser = require('body-parser');
const handlebar = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

app.engine('handlebars', handlebar({defaultLayout: false}));
app.set('view engine', 'handlebars');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/data', async (req, res) => {
    const mailbody = `
      <h2>Contact thread traced from:</h2>
      <ul>
        <li>Name -- ${req.body.alias}</li>
        <li>Email -- ${req.body.mailbox}</li>
      </ul>
      <hr>
      <h3>Message</h3>
      <p>${req.body.letter}</p>
    `;

    let transporter = nodemailer.createTransport({
        host: '',
        port: 587,
        secure: false,
        auth: {
            user: '',
            pass: ''
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let info = await nodemailer.sendMail({
        from: '',
        to: '',
        subject: '',
        text: '',
        html: mailbody
    });

    console.log('Message dropped! %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.redirect('contact');
});

app.listen(300);