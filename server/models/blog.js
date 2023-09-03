module.exports = (sequelize, DataTypes) => {
    const Blog =  sequelize.define('Blog', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    });

    Blog.associate = function(models) {
        Blog.belongsTo(models.User, {
          foreignKey: 'userId',
          as: 'user'
        });
    };
    return Blog;
};
