"use strict";
const nodemailer = require("nodemailer")
const axios = require('axios')

const dotenv = require("dotenv")
dotenv.config()


async function downloadFileFromUrl(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' })
        return response.data
    } catch (error) {
        throw new Error('Une erreur est survenue lors du téléchargement du fichier:', error)
    }
}

function convertToBase64(data) {
    return Buffer.from(data).toString('base64')
}

let fileToSend

async function create(to, emails, reportPath, subject) {

    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    })

    const fileUrl = reportPath
    try {
        const fileData = await downloadFileFromUrl(fileUrl)
        const base64Data = convertToBase64(fileData)
        // console.log(base64Data)
        fileToSend = base64Data
    } catch (error) {
        // console.error(error)
    }

    let html = "<div style='text-align: center; width: 75%; margin: auto;'>" +
        "<img width='200' src='https://api.sogevo.com/db/images/sogenuvotext.c10bb605e4544c837e8a7ffe5e986a60.svg' /><br /><br />"+
        "<b>Un rapport de panne vient d'être envoyé.</b>" +
        "<p>Chère propriétaire, nous vous notifions qu'un rapport de panne vient de vous être envoyée. Rendez-vous sur votre application mobile pour plus de détails." +
        "Il s'agit d'une alerte automatique venant du service de gestion de factures de SOGEVO.</p><br /><br /><br />" +
        "<p><small>SOGEVO - " + new Date().getFullYear() + " | Copyright - Tous droits réservés.<br /><b>Léo 2000, Lomé - TOGO BP 121. 00 228 91 01 92 45</b></small></p>" +
        "</div>"

    const message = {
        from: process.env.MAIL_FROM,
        to: to,
        subject: subject ? subject : "Rapport de panne",
        html: html,
        cc: emails,
        attachments: [
            {
                filename: 'Rapport.pdf',
                content: fileToSend,
                path: reportPath,
                href: reportPath,
                encoding: 'utf-8'
            },
        ]
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