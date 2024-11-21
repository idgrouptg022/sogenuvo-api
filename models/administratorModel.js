module.exports = (sequelize, DataTypes) => {
    const Administrator = sequelize.define("administrator", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        socket: {
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
        },
        rightsId: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        defaultScope: {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }
    })

    return Administrator
}