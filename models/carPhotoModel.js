module.exports = (sequelize, DataTypes) => {
    const CarPhotoModel = sequelize.define("carPhoto", {
        carPhoto: {
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

    return CarPhotoModel
}