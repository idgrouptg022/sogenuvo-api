module.exports = (sequelize, DataTypes) => {
    const Agency = sequelize.define("agency", {
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phoneNumberBis: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        responsibleFullName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fullAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date()
        }
    }, {
        defaultScope: {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }
    })

    return Agency
}