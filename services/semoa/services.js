const https = require('https')
const queryString = require('querystring')

async function authenticate() {
    return new Promise((resolve, reject) => {

        const postData = queryString.stringify({
            grant_type: process.env.GRANT_TYPE,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            username: process.env.SOGENUVO_USERNAME,
            password: process.env.PASSWORD,
            scopes: process.env.SCOPE,
        })
    
        const options = {
            protocol: 'https:',
            hostname: 'api.semoa-pro.com',
            port: 443,
            method: 'POST',
            path: '/prod-v2/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        const req = https.request(options, (res) => {
            let body = ''
            res.on('data', (chunk) => {
                body += chunk
            })

            res.on('end', () => {
                if (res.statusCode / 2 === 100) {
                    resolve(JSON.parse(body))
                }
                else {
                    console.log('failed')
                    resolve('Failure')
                }
            })
            res.on('error', () => {
                console.log('error')
                reject(Error('HTTP call failed'))
            })
        })
        req.write(postData)
        req.end()
    })
}

async function createOrder(token, orderId, recipient, amount, service) {

    return new Promise((resolve, reject) => {

        const postData = {
            recipient: recipient,
            amount: parseInt(amount, 10),
            service: service,
            thirdPartyReference: orderId,
            callbackUrl: 'https://api.sogevo.com/v1.0.0/payments/services/call-back-url'
        }
    
        const options = {
            protocol: 'https:',
            hostname: 'api.semoa-pro.com',
            port: 443,
            method: 'POST',
            path: '/prod-v2/orders/momo',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Request-id': `request-${orderId}`
            }
        }

        const req = https.request(options, (res) => {
            let body = ''
            res.on('data', (chunk) => {
                body += chunk
            })

            res.on('end', () => {
                if (res.statusCode / 2 === 100) {
                    resolve(JSON.parse(body))
                }
                else {
                    console.log('failed')
                    resolve(JSON.parse(body))
                }
            })
            res.on('error', () => {
                console.log('error')
                reject(Error('HTTP call failed'))
            })
        })
        req.write(JSON.stringify(postData))
        req.end()
    })
}

module.exports = {
    authenticate,
    createOrder,
}