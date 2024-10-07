module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("category", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        icone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        defaultScope: {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }
    })

    return Category
}