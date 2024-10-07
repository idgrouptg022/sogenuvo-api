"use strict";
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
dotenv.config()

async function payment(to, subject) {

    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    })

    let html = "<div style='text-align: center; width: 75%; margin: auto;'>"+
                    "<img width='200' src='https://api.sogevo.com/db/images/sogenuvotext.c10bb605e4544c837e8a7ffe5e986a60.svg' /><br /><br />"+
                    "<b>Bonjour !</b>"+
                    "<p>Une opération vient d'être faite sur votre compte SOGENUVO " +
                    "Rendez-vous dans l'application pour plus de détails..</p>" +
                    "<br /><br /><br />"+
                    "<p><small>SOGEVO - " + new Date().getFullYear() + " | Copyright - Tous droits réservés.<br /><b>Léo 2000, Lomé - TOGO BP 121. 00 228 91 01 92 45</b></small></p>" +
                "</div>"

    const message = {
        from: process.env.MAIL_FROM,
        to: to,
        subject: subject,
        html: html
    }

    await transporter.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            // console.log(info);
        }
    })
}

module.exports = {
    payment,
}
