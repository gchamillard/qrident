var express = require('express');
var router = express.Router();
var qrcode = require("qrcode");
const nodemailer = require("nodemailer");
const logger = require('./logger');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('createqr', {
        title: 'QRCode Ident',
        saisie: true
    });
});

router.post("/scan", (req, res, next) => {
    let input_identite = req.body.identite;
    let input_code = req.body.code;
    let contenuQR = input_identite + "\n" + input_code;

    qrcode.toDataURL(contenuQR, (err, src) => {
        if (err) {
            res.send("Un problème est survenu !!!");
            logger.error('Error message');
        }

        let transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                // Vos identifiants à mettre...
                user: "xxxxxxxxxxxxxx",
                pass: "xxxxxxxxxxxxxx"
            }
        });

        let mailOptions = {
            from: 'qrident@exemple.com',
            to: input_code+'@gmail.com',
            subject: "QRCode",
            text: "Envoi de QRCode",
            html: 'QRCode de "'+input_identite+'" : <img src="'+src+'"/>',
            attachments: [{
                filename: src,
                cid: src // Mettre à l'identique img src
            }]
        };

        transport.sendMail(mailOptions, function (error, info) {
            if (error) {
                logger.error("mail pas bien envoyé");
                console.log(error);
            } else {
                logger.info("mail bien envoyé");
                console.log('Email sent: ' + info.response);
            }
        });

        logger.info(input_identite);

        res.render("createqr", {
            title: "Générateur QR Code",
            saisie: false,
            qr_code: src
        });
    });
});


module.exports = router;
