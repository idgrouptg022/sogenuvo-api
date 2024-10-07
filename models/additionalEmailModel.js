module.exports = (sequelize, DataTypes) => {
    const AdditionalEmail = sequelize.define("additionalEmail", {
        email: {
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

    return AdditionalEmail
}