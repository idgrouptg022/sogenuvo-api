module.exports = (sequelize, DataTypes) => {
    const Owner = sequelize.define("owner", {
        ref: {
            type: DataTypes.STRING,
            allowNull: true
        },
        accountType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        balance: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phoneNumberBis: {
            type: DataTypes.STRING,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        idCardNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        idCard: {
            type: DataTypes.STRING,
            allowNull: true
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        socialReason: {
            type: DataTypes.STRING,
            allowNull: true
        },
        nif: {
            type: DataTypes.STRING,
            allowNull: true
        },
        rccm: {
            type: DataTypes.STRING,
            allowNull: true
        },
        responsibleFullName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cfeCard: {
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

    return Owner
}