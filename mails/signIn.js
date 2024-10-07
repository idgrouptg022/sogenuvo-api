"use strict";
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
dotenv.config()

async function confirmation(to, code) {

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
                    "<b>Utilisez le code suivant pour confirmer votre email.</b>"+
                    "<p>Pour confirmer votre email et pouvoir vous connecter à votre compte, veuillez utiliser le code de confirmation ci-dessous. " +
                    "Il s'agit d'une mesure supplémentaire de sécurité mise en place pour préserver au mieux l'accès à votre compte SOGEVO.</p>" +
                    "<table style='margin: auto;'>"+
                        "<tbody>"+
                            "<tr>"+
                                "<td>"+
                                    "<h1 style='border: 1px solid #CCC; padding: 10px; border-radius: 7px;'>" + code.substring(0, 1) + "</h1>"+
                                "</td>"+
                                "<td>"+
                                    "<h1 style='border: 1px solid #CCC; padding: 10px; border-radius: 7px;'>" + code.substring(1, 2) + "</h1>"+
                                "</td>"+
                                "<td>"+
                                    "<h1 style='border: 1px solid #CCC; padding: 10px; border-radius: 7px;'>" + code.substring(2, 3) + "</h1>"+
                                "</td>"+
                                "<td>"+
                                    "<h1 style='border: 1px solid #CCC; padding: 10px; border-radius: 7px;'>" + code.substring(3, 4) + "</h1>"+
                                "</td>"+
                                "<td>"+
                                    "<h1 style='border: 1px solid #CCC; padding: 10px; border-radius: 7px;'>" + code.substring(4, 5) + "</h1>"+
                                "</td>"+
                                "<td>"+
                                    "<h1 style='border: 1px solid #CCC; padding: 10px; border-radius: 7px;'>" + code.substring(5) + "</h1>"+
                                "</td>"+
                            "</tr>"+
                        "</tbody>"+
                    "</table><br /><br /><br />"+
                    "<p><small>SOGEVO - " + new Date().getFullYear() + " | Copyright - Tous droits réservés.<br /><b>Léo 2000, Lomé - TOGO BP 121. 00 228 91 01 92 45</b></small></p>" +
                "</div>"

    const message = {
        from: process.env.MAIL_FROM,
        to: to,
        subject: "Code de confirmation",
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
    confirmation,
}
