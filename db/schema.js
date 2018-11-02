/**
 * database schema
 */

let sequelizeLibrary = require('sequelize'),
    sequelize = new sequelizeLibrary(
        global.config.database.name,
        global.config.database.user.name,
        global.config.database.user.password, {
            dialect: 'mysql',
            host: global.config.database.host,
            port: global.config.database.port,
            logging: global.config.database.logging ? global.logger.info : console.info,
            define: {
                charset: 'utf8',
                collate: 'utf8_general_ci',
                timestamps: false
            },
            pool: {
                max: 30,
                min: 1,
                idle: 10000
            },
        }),
    user = sequelize.define('user', {
        id: {
            type: sequelizeLibrary.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        nickname: sequelizeLibrary.STRING(320),
        email: sequelizeLibrary.STRING(320),
        password: sequelizeLibrary.TEXT,
        isFB: {
            type: sequelizeLibrary.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    }, {
        indexes: [{
        //     unique: true,
        //     fields: [{attribute: 'nickname', length: 32}]
        // }, {
        //     unique: true,
        //     fields: [{attribute: 'email', length: 32}]
        // }, {
            unique: true,
            fields: [{
            //     attribute: 'nickname', length: 32
            // }, {
                attribute: 'email', length: 32
            }, {
                attribute: 'isFB'
            }]
        }]
    }),
    article = sequelize.define('article', {
        id: {
            type: sequelizeLibrary.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        datetime: {
            type: sequelizeLibrary.DATE,
            defaultValue: sequelizeLibrary.NOW
        },
        title: {
            type: sequelizeLibrary.STRING(320),
            defaultValue: ''
        },
        subtitle: {
            type: sequelizeLibrary.STRING(320),
            defaultValue: ''
        },
        description: {
            type: sequelizeLibrary.STRING(320),
            defaultValue: ''
        },
        mediatype: {
            type: sequelizeLibrary.ENUM('text', 'image', 'video'),
            defaultValue: 'text',
            allowNull: false
        },
        likes: {
            type: sequelizeLibrary.INTEGER.UNSIGNED,
            defaultValue: 0
        }
    }),
    comment = sequelize.define('comment', {
        id: {
            type: sequelizeLibrary.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        datetime: {
            type: sequelizeLibrary.DATE,
            defaultValue: sequelizeLibrary.NOW
        },
        text: sequelizeLibrary.TEXT
    }),
    feed = sequelize.define('feed', {
        id: {
            type: sequelizeLibrary.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: sequelizeLibrary.STRING(320)
    }, {
        indexes: [{
            unique: true,
            fields: [{attribute: 'name', length: 32}]
        }]
    }),
    friendship = sequelize.define(
        'friendship', {
            id: {
                type: sequelizeLibrary.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
            },
            userA: sequelizeLibrary.INTEGER.UNSIGNED,
            userB: sequelizeLibrary.INTEGER.UNSIGNED,
            isAccepted: {
                type: sequelizeLibrary.BOOLEAN,
                defaultValue: false
            }
        }
    ),
    userArticleLike = sequelize.define('user_article_like', {
        id: {
            type: sequelizeLibrary.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: sequelizeLibrary.INTEGER.UNSIGNED
        },
        articleId: {
            type: sequelizeLibrary.INTEGER.UNSIGNED
        }
    }),
    poll_result = sequelize.define('poll_result', {
        id: {
            type: sequelizeLibrary.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: sequelizeLibrary.INTEGER.UNSIGNED
        },
        answer: sequelizeLibrary.INTEGER,
        pollId: sequelizeLibrary.INTEGER.UNSIGNED
    },
	{
        indexes: [
					{
					  name: 'polls_users',
					  method: 'BTREE',
					  unique: true,
					  fields: [{attribute: 'pollId'},{attribute: 'userId'}]
					}
				]
	}
	),
    medialink = sequelize.define(
        'medialink', {
            uuid: {
                type: sequelizeLibrary.UUID,
                primaryKey: true
            },
            ratio: {
                type: sequelizeLibrary.DECIMAL(8, 4),
                defaultValue: false
            }
        }
    ),
    fcm = sequelize.define(
        'fcm', {
            token: {
                type: sequelizeLibrary.STRING(200),
                defaultValue: '',
                unique: true,
            }
        }
    ),
    chatmsg = sequelize.define(
        'chatmsg', {
            id: {
                type: sequelizeLibrary.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },
            datetime: {
                type: sequelizeLibrary.DATE,
                defaultValue: sequelizeLibrary.NOW
            },
            text: {
                type: sequelizeLibrary.STRING(320),
                defaultValue: '',
            }
        }
    ),
    overlay = sequelize.define(
        'overlay', {
            id: {
                type: sequelizeLibrary.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: sequelizeLibrary.STRING(320),
                defaultValue: ''
            },
            type: {
                type: sequelizeLibrary.STRING(20),
                defaultValue: ''
            },
            previewUuid: {
                type: sequelizeLibrary.STRING(320),
                defaultValue: ''
            },
            androidFileUuid: {
                type: sequelizeLibrary.STRING(320),
                defaultValue: ''
            },
            iosFileUuid: {
                type: sequelizeLibrary.STRING(320),
                defaultValue: ''
            },
        }
    ),
	
    poll = sequelize.define('poll', {
        id: {
            type: sequelizeLibrary.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
		
        name: sequelizeLibrary.STRING(320),
		
        isActive: {
                type: sequelizeLibrary.BOOLEAN,
                defaultValue: true
            }
    }
	)
	;

fcm.belongsTo(user);

chatmsg.belongsTo(user);

user.belongsToMany(article, {
    through: {
        model: userArticleLike
    },
    foreignKey: 'userId'
});

article.belongsToMany(user, {
    as: 'like',
    through: {
        model: userArticleLike
    },
    foreignKey: 'articleId'
});
friendship.belongsTo(user, {as: 'userAIdFK', foreignKey: 'userA'});
friendship.belongsTo(user, {as: 'userBIdFK', foreignKey: 'userB'});
article.belongsTo(user, {as: 'author', foreignKey: 'userId'});
article.belongsTo(feed);
comment.belongsTo(user);
comment.belongsTo(article);
article.hasMany(comment);

user.hasMany(article);
user.hasMany(comment);
feed.hasMany(article);
article.belongsTo(medialink);
// overlay.belongsTo(medialink, {as: 'preview'});
// overlay.belongsTo(medialink, {as: 'file'});

// if (global.config.database.force === true) {
//     sequelize
//         .query('SET FOREIGN_KEY_CHECKS = 0')
//         .then(() => {
//             return sequelize
//                 .sync({
//                     force: global.config.database.force,
//                     logging: global.config.database.logging ? global.logger.info : false
//                 });
//         })
//         .then(() => {
//             global.logger.info('database synced');
//             return sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
//         })
// } else {
//     global.logger.info('database not synced');
// }

module.exports = {
    sequelize: sequelize
    , user: user
    , article: article
    , feed: feed
    , comment: comment
    , friendship: friendship
    , userArticleLike: userArticleLike
    , medialink: medialink
    , fcm
    , chatmsg
    , overlay
    , poll: poll
    , poll_result: poll_result
};
