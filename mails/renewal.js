"use strict";
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
dotenv.config()

async function create(to) {

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
                    "<b>Une demande de renouvelle a été créée</b>"+
                    "<p>Chère propriétaire, nous vous notifions qu'une demande de renouvellement a été créée sur l'une de vos voitures. Vous pouvez vous rendre plutars sur l'application pour plus de détails." +
                    "Il s'agit d'une alerte automatique venant du service de gestion d'incidents de SOGEVO.</p><br /><br /><br />" +
                    "<p><small>SOGEVO - " + new Date().getFullYear() + " | Copyright - Tous droits réservés.<br /><b>Léo 2000, Lomé - TOGO BP 121. 00 228 91 01 92 45</b></small></p>" +
                "</div>"

    const message = {
        from: process.env.MAIL_FROM,
        to: to,
        subject: "Demande de renouvellement",
        html: html
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
