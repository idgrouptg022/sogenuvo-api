module.exports = (sequelize, DataTypes) => {
    const Country = sequelize.define("country", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        isoCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phoneCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    }, {
        defaultScope: {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }
    })

    return Country
}