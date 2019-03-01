'use strict';

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		server_id: {
			type: DataTypes.STRING,
			defaultValue: 0,
			allowNull: false,
		},
		xp: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		coins:  {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}, {});
	User.associate = function(models) {
		// associations can be defined here
	};
	return User;
};
/*

user_id: {
	type: DataTypes.STRING,
		primaryKey: true,
},
server_id: {
	type: DataTypes.STRING,
		defaultValue: 0,
		allowNull: false,
},
xp: {
	type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
},
coins: {
	type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
},*/
