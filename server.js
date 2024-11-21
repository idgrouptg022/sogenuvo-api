const express = require("express")
const cors = require("cors")
const fileUpload = require('express-fileupload')
const { Server } = require('socket.io')
const http = require('http')
// const authenticationRouter = require('./routes/admin/authentication')
// const administratorsRouter = require('./routes/admin/crud')
// const cardTypeRouter = require('./routes/cardType/crud')
// const ownerRouter = require('./routes/owner/crud')
// const ownerCarRouter = require('./routes/owner/services')
// const ownerAuthenticationRouter = require('./routes/owner/authentication')
// const userAuthenticationRouter = require('./routes/user/authentication')
// const additionalEmailRouter = require('./routes/owner/emails/crud')
// const CarRouter = require('./routes/car/crud')
// const CarCategoryRouter = require('./routes/category/crud')
// const RentalCarRouter = require('./routes/car/rent/crud')
// const UserRentalCarRouter = require('./routes/user/services')
// const PaymentRouter = require('./routes/payment/crud')
// const AssuranceRouter = require('./routes/assurance/crud')
// const TechnicalVisitRouter = require('./routes/technicalVisit/crud')
// const TvmRouter = require('./routes/tvm/crud')
// const OutDatesRouter = require('./routes/outdates/service')
// const InvoicesRouter = require('./routes/invoice/crud')
// const ReportRouter = require('./routes/reports/crud')

// const AccidentRouter = require('./routes/accident/crud')
// const BreakDownRouter = require('./routes/breakdowns/crud')
// const MaintenanceRouter = require('./routes/maintenances/crud')
// const RenewalRouter = require('./routes/renewal/crud')
// const SettingRouter = require('./routes/settings/crud')
// const FundRouter = require('./routes/funds/crud')
// const NotificationRouter = require('./routes/notifications/crud')

// const GeolocationNotificationRouter = require('./routes/geolocationNotifications/crud')

const countryRouter = require('./routes/countries/crud')

const agencyRouter = require('./routes/agencies/crud')
const agencyAuthRouter = require('./routes/agencies/auth')
const administratorRouter = require('./routes/administrators/crud')
const administratorAuthRouter = require('./routes/administrators/auth')
const ownerAuthRouter = require('./routes/owner/auth')

const carRouter = require('./routes/cars/crud')

const dotenv = require("dotenv").config()

const db = require('./models')

const Administrator = db.administrators

const app = express()

const port = process.env.SERVER_PORT || 5001

let corsOptions = {
    origin: [
        "https://admin.sogevo.com",
        "https://shop.sogevo.com",
        "https://www.shop.sogevo.com",
        "https://sogenuvo.com", 
        "https://www.sogenuvo.com", 
        "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
}

app.use("/db", express.static(__dirname + '/db'))
app.use(cors(corsOptions))
app.use(express.json())
app.use(fileUpload())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["https://admin.sogevo.com", "https://sogenuvo.com", "https://shop.sogevo.com", "http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
})
global.io = io

io.on('connection', async (socket) => {
    try {
        await Administrator.update({socket: socket.id}, { where: { id: socket.handshake.query.id } })
    } catch (error) {
        console.log(error)
    }

    try {
        socket.on('disconnect', async () => {
            // await Administrator.update({socket: null}, { where: { id: socket.handshake.query.id } })
        })
    } catch (error) {
        console.log(error)
    }
})

// app.use(`/${process.env.API_PREFIX_URL}`, authenticationRouter)
// app.use(`/${process.env.API_PREFIX_URL}/admnistrators`, administratorsRouter)
// app.use(`/${process.env.API_PREFIX_URL}/card-types`, cardTypeRouter)
// app.use(`/${process.env.API_PREFIX_URL}/owners`, ownerRouter)
// app.use(`/${process.env.API_PREFIX_URL}/owners`, ownerAuthenticationRouter)
// app.use(`/${process.env.API_PREFIX_URL}/users`, userAuthenticationRouter)
// app.use(`/${process.env.API_PREFIX_URL}/owners`, ownerCarRouter)
// app.use(`/${process.env.API_PREFIX_URL}/owners/emails`, additionalEmailRouter)
// app.use(`/${process.env.API_PREFIX_URL}/owners/cars`, CarRouter)
// app.use(`/${process.env.API_PREFIX_URL}/payments`, PaymentRouter)
// app.use(`/${process.env.API_PREFIX_URL}/assurances`, AssuranceRouter)
// app.use(`/${process.env.API_PREFIX_URL}/technical-visits`, TechnicalVisitRouter)
// app.use(`/${process.env.API_PREFIX_URL}/tvms`, TvmRouter)
// app.use(`/${process.env.API_PREFIX_URL}/outdates`, OutDatesRouter)
// app.use(`/${process.env.API_PREFIX_URL}/invoices`, InvoicesRouter)
// app.use(`/${process.env.API_PREFIX_URL}/reports`, ReportRouter)

// app.use(`/${process.env.API_PREFIX_URL}/accidents`, AccidentRouter)
// app.use(`/${process.env.API_PREFIX_URL}/breakdowns`, BreakDownRouter)
// app.use(`/${process.env.API_PREFIX_URL}/maintenances`, MaintenanceRouter)
// app.use(`/${process.env.API_PREFIX_URL}/renewals`, RenewalRouter)
// app.use(`/${process.env.API_PREFIX_URL}/settings`, SettingRouter)
// app.use(`/${process.env.API_PREFIX_URL}/funds`, FundRouter)
// app.use(`/${process.env.API_PREFIX_URL}/notifications`, NotificationRouter)
// app.use(`/${process.env.API_PREFIX_URL}/geolocation-notifications`, GeolocationNotificationRouter)

// app.use(`/${process.env.API_PREFIX_URL}/owners/cars/rental/list`, RentalCarRouter)
// app.use(`/${process.env.API_PREFIX_URL}/rentals`, UserRentalCarRouter)

// app.use(`/${process.env.API_PREFIX_URL}/cars/categories`, CarCategoryRouter)

app.use(`/${process.env.API_PREFIX_URL}/countries`, countryRouter)

app.use(`/${process.env.API_PREFIX_URL}/agencies`, agencyRouter)
app.use(`/${process.env.API_PREFIX_URL}/auth/agencies`, agencyAuthRouter)
app.use(`/${process.env.API_PREFIX_URL}/administrators`, administratorRouter)
app.use(`/${process.env.API_PREFIX_URL}/auth/administrators`, administratorAuthRouter)
app.use(`/${process.env.API_PREFIX_URL}/auth/owners`, ownerAuthRouter)

app.use(`/${process.env.API_PREFIX_URL}/cars`, carRouter)

server.listen(port, () => {
    console.log(`sogevo-api is running on port ${port} ...`)
})