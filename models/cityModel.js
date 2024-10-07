module.exports = (sequelize, DataTypes) => {
    const City = sequelize.define("city", {
        name: {
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

    return City
}