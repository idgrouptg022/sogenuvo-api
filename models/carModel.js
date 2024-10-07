module.exports = (sequelize, DataTypes) => {
    const Car = sequelize.define("car", {
        brand: {
            type: DataTypes.STRING,
            allowNull: false
        },
        grayCardNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        chassisNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        carPlateSeries: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        carPlateNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: true
        },
        geolocation: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        locationFees: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        shopFees: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        isOnRace: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        isOnLocation: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isPopular: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        notation: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        places: {
            type: DataTypes.INTEGER,
            defaultValue: 5
        },
        doors: {
            type: DataTypes.INTEGER,
            defaultValue: 4
        },
        airConditioner: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        transmission: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        state: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        defaultScope: {
            attributes: {
                exclude: []
            }
        }
    })

    return Car
}