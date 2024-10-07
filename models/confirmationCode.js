module.exports = (sequelize, DataTypes) => {
    const ConfirmationCode = sequelize.define("confirmationCode", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        source: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        defaultScope: {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }
    })

    return ConfirmationCode
}