"use strict";
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")

const axios = require('axios')
const fs = require('fs')
const path = require('path')

dotenv.config()

let fileToSend

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

async function main() {
    const fileUrl = 'https://api.sogevo.com/db/images/logobackwhite.jpg'
    try {
        const fileData = await downloadFileFromUrl(fileUrl)
        const base64Data = convertToBase64(fileData)
        // console.log(base64Data)
        fileToSend = base64Data
    } catch (error) {
        // console.error(error)
    }
}

main()


async function registration(to, password, emails) {

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
        "<h3><b>Compte propétaire SOGEVO créé !</b></h3>" +
        "<p>Bonjour chèr-e propriétaire, nous avons le plasir de vous informer que votre compte a été créé avec succès. " +
        "Dès à présent, vous pouvez vous connecter à votre espace avec les information ci-dessous " +
        "sur notre apllication mobile pour le suivi de vos voitures.</p>" +
        "<p><b>Paramètres de connexion (<span style='color: red;'>Informations confidentielles</span>)<b></p>" +
        "<b>Email :</b> " + to + "<br />" +
        "<b>Mot de passe :</b> " + password + "<br />" +
        "<p>Si vous rencontrez des difficultés à vous connecter, une assistance joignable sur le <b>00 228 91 01 92 45</b> est à votre disposition.</p>" +
        "<br /><br /><br />" +
        "<p><small>SOGEVO - " + new Date().getFullYear() + " | Copyright - Tous droits réservés.<br /><b>Léo 2000, Lomé - TOGO BP 121. 00 228 91 01 92 45</b></small></p>" +
        "</div>"


    const message = {
        from: process.env.MAIL_FROM,
        to: to,
        subject: "Création de compte SOGEVO.",
        html: html,
        cc: emails,
        attachments: [
            {
                filename: 'Logo SOGEVO.jpg',
                content: fileToSend,
                path: 'https://api.sogevo.com/db/images/sogenuvotext.c10bb605e4544c837e8a7ffe5e986a60.svg',
                href: 'https://api.sogevo.com/db/images/sogenuvotext.c10bb605e4544c837e8a7ffe5e986a60.svg',
                encoding: 'utf-8'
            },
        ]
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
    registration,
}
