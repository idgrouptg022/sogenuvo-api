const dbConfig = require("../configs/dbConfig")
const { Sequelize, DataTypes } = require("sequelize")

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operationsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
}
)

sequelize.authenticate()
    .then(() => {
        console.log('Database connected ...')
    })
    .catch(err => {
        console.log('Error ' + err);
    })

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

/*db.carousels = require('./carouselModel')(sequelize, DataTypes)

db.confirmationCodes = require('./confirmationCodeModel')(sequelize, DataTypes)

db.administrators = require('./administratorModel')(sequelize, DataTypes)
db.groupRoles = require('./groupRoleModels')(sequelize, DataTypes)
db.roles = require('./roleModel')(sequelize, DataTypes)


db.owners = require('./ownerModel')(sequelize, DataTypes)
db.additionalEmails = require('./additionalEmailModel')(sequelize, DataTypes)
db.cardTypes = require('./cardTypeModel')(sequelize, DataTypes)


db.cars = require('./carModel')(sequelize, DataTypes)
db.payments = require('./paymentModel')(sequelize, DataTypes)
db.funds = require('./fundModel')(sequelize, DataTypes)
db.assurances = require('./assuranceModel')(sequelize, DataTypes)
db.technicalVisits = require('./technicalVisitModel')(sequelize, DataTypes)
db.tvms = require('./tvmModel')(sequelize, DataTypes)
db.accidents = require('./accidentModel')(sequelize, DataTypes)
db.breakDowns = require('./breakDownModel')(sequelize, DataTypes)


db.maintenances = require('./maintenanceModel')(sequelize, DataTypes)

db.invoices = require('./invoiceModel')(sequelize, DataTypes)
db.reports = require('./reportModel')(sequelize, DataTypes)

db.settings = require('./settingModel')(sequelize, DataTypes)

db.geolocationNotifications = require('./geolocationNotificationModel')(sequelize, DataTypes)

db.comments = require('./commentModel')(sequelize, DataTypes)
db.carPhotos = require('./carPhotoModel')(sequelize, DataTypes)

db.outdates = require('./outdateModel')(sequelize, DataTypes)
db.notifications = require('./notificationsModel')(sequelize, DataTypes)

db.renewals = require('./renewalModel')(sequelize, DataTypes)
db.rights = require('./rightModel')(sequelize, DataTypes)

db.users = require('./userModel')(sequelize, DataTypes)
db.rents = require('./rentModel')(sequelize, DataTypes)

db.categories = require('./categoryModel')(sequelize, DataTypes)
*/

db.confirmationCodes = require('./confirmationCode')(sequelize, DataTypes)

db.countries = require('./countryModel')(sequelize, DataTypes)
db.cities = require('./cityModel')(sequelize, DataTypes)

db.agencies = require('./agencyModel')(sequelize, DataTypes)
db.cardTypes = require('./cardTypeModel')(sequelize, DataTypes)
db.owners = require('./ownerModel')(sequelize, DataTypes)
db.additionnalEmails = require('./additionalEmailModel')(sequelize, DataTypes)

db.categories = require('./categoryModel')(sequelize, DataTypes)
db.cars = require('./carModel')(sequelize, DataTypes)
db.carsPhotos = require('./carPhotoModel')(sequelize, DataTypes)
db.administrators = require('./administratorModel')(sequelize, DataTypes)



/*db.groupRoles.hasMany(db.roles, {
    onDelete: 'cascade'
})
db.roles.belongsTo(db.groupRoles)


db.administrators.hasMany(db.groupRoles, {
    onDelete: 'cascade'
})
db.groupRoles.belongsTo(db.administrators)


db.administrators.hasMany(db.roles, {
    onDelete: 'cascade'
})
db.roles.belongsTo(db.administrators)


db.administrators.belongsToMany(db.roles, { through: 'adminRoles' })
db.roles.belongsToMany(db.administrators, { through: 'adminRoles' })


db.administrators.hasMany(db.owners, {
    onDelete: 'cascade'
})
db.owners.belongsTo(db.administrators)


db.administrators.hasMany(db.cardTypes, {
    onDelete: 'cascade'
})
db.cardTypes.belongsTo(db.administrators)


db.administrators.hasMany(db.cars, {
    onDelete: 'cascade'
})
db.cars.belongsTo(db.administrators)

db.owners.hasMany(db.roles, {
    onDelete: 'cascade'
})


db.owners.hasMany(db.cars, {
    onDelete: 'cascade'
})
db.cars.belongsTo(db.owners)


db.owners.hasMany(db.funds, {
    onDelete: 'cascade'
})
db.funds.belongsTo(db.owners)


db.administrators.hasMany(db.payments, {
    onDelete: 'cascade'
})
db.payments.belongsTo(db.administrators)


db.cardTypes.hasMany(db.owners, {
    onDelete: 'cascade'
})
db.owners.belongsTo(db.cardTypes)


db.owners.hasMany(db.additionalEmails, {
    onDelete: 'cascade'
})
db.additionalEmails.belongsTo(db.owners)


db.owners.hasMany(db.accidents, {
    onDelete: 'cascade'
})
db.accidents.belongsTo(db.owners)


db.owners.hasMany(db.maintenances, {
    onDelete: 'cascade'
})
db.maintenances.belongsTo(db.owners)


db.accidents.hasMany(db.invoices, {
    onDelete: 'cascade'
})
db.invoices.belongsTo(db.accidents)


db.accidents.hasMany(db.reports, {
    onDelete: 'cascade'
})
db.reports.belongsTo(db.accidents)


db.cars.hasMany(db.payments, {
    onDelete: 'cascade'
})
db.payments.belongsTo(db.cars)


db.cars.hasMany(db.carPhotos, {
    onDelete: 'cascade'
})
db.carPhotos.belongsTo(db.cars)


db.owners.hasMany(db.payments, {
    onDelete: 'cascade'
})
db.payments.belongsTo(db.owners)


db.cars.hasMany(db.assurances, {
    onDelete: 'cascade'
})
db.assurances.belongsTo(db.cars)


db.cars.hasMany(db.technicalVisits, {
    onDelete: 'cascade'
})
db.technicalVisits.belongsTo(db.cars)


db.cars.hasMany(db.tvms, {
    onDelete: 'cascade'
})
db.tvms.belongsTo(db.cars)


db.cars.hasMany(db.breakDowns, {
    onDelete: 'cascade'
})
db.breakDowns.belongsTo(db.cars)


db.owners.hasMany(db.breakDowns, {
    onDelete: 'cascade'
})
db.breakDowns.belongsTo(db.owners)


db.breakDowns.hasMany(db.invoices, {
    onDelete: 'cascade'
})
db.invoices.belongsTo(db.breakDowns)


db.cars.hasMany(db.accidents, {
    onDelete: 'cascade'
})
db.accidents.belongsTo(db.cars)


db.cars.hasMany(db.maintenances, {
    onDelete: 'cascade'
})
db.maintenances.belongsTo(db.cars)


db.maintenances.hasMany(db.invoices, {
    onDelete: 'cascade'
})
db.invoices.belongsTo(db.maintenances)


db.cars.hasMany(db.invoices, {
    onDelete: 'cascade'
})
db.invoices.belongsTo(db.cars)


db.invoices.hasMany(db.comments, {
    onDelete: 'cascade'
})
db.comments.belongsTo(db.invoices)


db.cars.hasMany(db.geolocationNotifications, {
    onDelete: 'cascade'
})
db.geolocationNotifications.belongsTo(db.cars)


db.cars.hasMany(db.outdates, {
    onDelete: 'cascade'
})
db.outdates.belongsTo(db.cars)


db.owners.hasMany(db.invoices, {
    onDelete: 'cascade'
})
db.invoices.belongsTo(db.owners)


db.owners.hasMany(db.geolocationNotifications, {
    onDelete: 'cascade'
})
db.geolocationNotifications.belongsTo(db.owners)


db.owners.hasMany(db.notifications, {
    onDelete: 'cascade'
})
db.notifications.belongsTo(db.owners)


db.owners.hasMany(db.renewals, {
    onDelete: 'cascade'
})
db.renewals.belongsTo(db.owners)

db.tvms.hasMany(db.renewals, {
    onDelete: 'cascade'
})
db.renewals.belongsTo(db.tvms)

db.assurances.hasMany(db.renewals, {
    onDelete: 'cascade'
})
db.renewals.belongsTo(db.assurances)

db.technicalVisits.hasMany(db.renewals, {
    onDelete: 'cascade'
})
db.renewals.belongsTo(db.technicalVisits)

db.cars.hasMany(db.renewals, {
    onDelete: 'cascade'
})
db.renewals.belongsTo(db.cars)

db.cars.hasMany(db.rents, {
    onDelete: 'cascade'
})
db.rents.belongsTo(db.cars)

db.users.hasMany(db.rents, {
    onDelete: 'cascade'
})
db.rents.belongsTo(db.users)

db.categories.hasMany(db.cars, {
    onDelete: 'cascade'
})
db.cars.belongsTo(db.categories)*/

db.countries.hasMany(db.cities, {
    onDelete: 'cascade'
})
db.cities.belongsTo(db.countries)

db.countries.hasMany(db.agencies, {
    onDelete: 'cascade'
})
db.agencies.belongsTo(db.countries)

db.cities.hasMany(db.agencies, {
    onDelete: 'cascade'
})
db.agencies.belongsTo(db.cities)

db.cities.hasMany(db.owners, {
    onDelete: 'cascade'
})
db.owners.belongsTo(db.cities)

db.cardTypes.hasMany(db.owners, {
    onDelete: 'cascade'
})
db.owners.belongsTo(db.cardTypes)

db.agencies.hasMany(db.owners, {
    onDelete: 'cascade'
})
db.owners.belongsTo(db.agencies)

db.owners.hasMany(db.additionnalEmails, {
    onDelete: 'cascade'
})
db.additionnalEmails.belongsTo(db.owners)

db.cars.hasMany(db.carsPhotos, {
    onDelete: 'cascade'
})
db.carsPhotos.belongsTo(db.cars)

db.categories.hasMany(db.cars, {
    onDelete: 'cascade'
})
db.cars.belongsTo(db.categories)

db.agencies.hasMany(db.cars, {
    onDelete: 'cascade'
})
db.cars.belongsTo(db.agencies)

db.countries.hasMany(db.cars, {
    onDelete: 'cascade'
})
db.cars.belongsTo(db.countries)

db.cities.hasMany(db.cars, {
    onDelete: 'cascade'
})
db.cars.belongsTo(db.cities)

db.sequelize.sync({ force: false })
    .then(() => {
        console.log("Re-sync done !")
    })

module.exports = db
