"use strict";
const nodemailer = require("nodemailer")

const dotenv = require("dotenv")
dotenv.config()

async function create(to, emails, attachments, object) {

    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    })

    let html = "<div style='text-align: center; width: 75%; margin: auto;'>" +
        "<img width='200' src='https://api.sogevo.com/db/images/sogenuvotext.c10bb605e4544c837e8a7ffe5e986a60.svg' /><br /><br />"+
        "<b>Rapport(s) d'accident envoyé(s).</b>" +
        "<p>Chère propriétaire, nous vous notifions qu'un ou plusieurs rapports d'accident viennent d'être envoyés. Rendez-vous sur votre application mobile pour plus de détails." +
        "Il s'agit d'une alerte automatique venant du service de gestion de factures de SOGEVO.</p><br /><br /><br />" +
        "<p><small>SOGEVO - " + new Date().getFullYear() + " | Copyright - Tous droits réservés.<br /><b>Léo 2000, Lomé - TOGO BP 121. 00 228 91 01 92 45</b></small></p>" +
        "</div>"

    const message = {
        from: process.env.MAIL_FROM,
        to: to,
        subject: object ? object : "Rapport(s) accident",
        html: html,
        cc: emails,
        attachments: attachments
    }

    await transporter.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            // console.log(info)
        }
    })
}

module.exports = {
    create,
}