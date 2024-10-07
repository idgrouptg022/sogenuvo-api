"use strict";
const nodemailer = require("nodemailer")

const axios = require('axios')
const fs = require('fs')
const path = require('path')

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

async function create(to, emails, report, object) {

    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    })

    const fileUrl = report

    if (report && report.trim().length > 0) {
        try {
            const fileData = await downloadFileFromUrl(fileUrl)
            const base64Data = convertToBase64(fileData)
            // console.log(base64Data)
            fileToSend = base64Data
        } catch (error) {
            // console.error(error)
        }
    }

    let html = "<div style='text-align: center; width: 75%; margin: auto;'>" +
        "<img width='200' src='https://api.sogevo.com/db/images/sogenuvotext.c10bb605e4544c837e8a7ffe5e986a60.svg' /><br /><br />"+
        "<b>Un maintenance vient d'être faite sur votre voiture.</b>" +
        "<p>Chère propriétaire, nous vous notifions qu'une maintenance vient d'être faite sur votre voiture. Rendez-vous sur votre application mobile pour plus de détails." +
        "Il s'agit d'une alerte automatique venant du service de gestion de rapports et de maintenance sogevo de SOGEVO.</p><br /><br /><br />" +
        "<p><small>SOGEVO - " + new Date().getFullYear() + " | Copyright - Tous droits réservés.<br /><b>Léo 2000, Lomé - TOGO BP 121. 00 228 91 01 92 45</b></small></p>" +
        "</div>"

    const message = {
        from: process.env.MAIL_FROM,
        to: to,
        subject: object ? object : "Rapport maintenance",
        html: html,
        cc: emails,
        attachments: (report && report.trim().length > 0) ? [
            {
                filename: 'Rapport.pdf',
                content: fileToSend,
                path: fileUrl,
                href: fileUrl,
                encoding: 'utf-8'
            },
        ] : []
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